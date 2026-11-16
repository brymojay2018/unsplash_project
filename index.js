
document.addEventListener(`DOMContentLoaded`, () => {
    
    // const inputsearch = document.getElementById(`searchInput`)
    const submitBtn = document.getElementById(`submitbtn`)
    const resultcontainer = document.querySelector(`.imagesdisplay`)
    const category = document.querySelectorAll(`.category`)
    const picturedisplay = document.querySelector(`.pictureDisplay`)
    const imageContent = document.querySelector(`.imagemodal`)
    const photoName = document.getElementById(`photo-name`)
    const creatorName = document.querySelector(`.name h3`)
    const creatorUsername = document.querySelector(`.name p`)
    const creatorpic = document.querySelector(`.creatorInfo img`)
    const creatorlike = document.querySelector(`.like p`)
    const creatorsave = document.querySelector(`.bookmark p`)
    const downloadlink = document.querySelector(`.photoStart a`)
    const userinputsearch = document.getElementById(searchInput)

    let arrayelement = JSON.parse(localStorage.getItem("arrayElement")) || []

    submitBtn.addEventListener(`click`, clickevent)

    // Aysnc function created for the button search button
    async function clickevent (){
        const inputsearch = document.getElementById(`searchInput`).value.trim()
        if (!inputsearch) return

        try {
            const result = await fetchImage(inputsearch)
            displayimage(result)

        } catch (error) {
            console.error(`Image URL can't be found`)

        }
        userinputsearch.value = ""
    }
          // Fetch image from the API call 
    async function fetchImage(inputsearch) {
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(inputsearch)}&per_page=30`

        const apiKey = `9xeq81N-mnknam40PA9iyS86gbowCKgylaVJCLZW2RU`

        const options = {
            method: "GET",
            headers: {
                'Authorization': `Client-ID ${apiKey}`,
                'Content-Type': 'application/json',
            }
        }
        const response = await fetch(url, options)
            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}`);
            }
            const photoimage = await response.json()
            return photoimage
            // console.log(photoimage)

    }

    // Display image
    function displayimage(data) {
        // Clear previous results
        resultcontainer.innerHTML = "";

        if (!data || !Array.isArray(data.results) || data.results.length === 0) {
            resultcontainer.textContent = "No images found.";
            return;
        }

        data.results.forEach(photo => {
            const { urls, alt_description, user,} = photo;
            const imagediv = document.createElement(`div`);
            imagediv.classList.add(`image`);
            const img = document.createElement(`img`);
            img.setAttribute(`alt`, urls.alt_description)
            img.setAttribute(`src`, urls.regular);
            imagediv.appendChild(img);
            resultcontainer.appendChild(imagediv); 

            // Getting clicked event on imagediv
            imagediv.addEventListener(`click`, () => {
                picturedisplay.style.display = `flex`
                const myimage = imagediv.querySelector(`img`)   
                imageContent.src = myimage.src
                photoName.textContent = alt_description
                creatorName.textContent = user.name
                creatorpic.src = user.profile_image.large
                creatorlike.textContent = user.total_likes
                creatorsave.textContent = user.total_free_photos
                const namecontent = user.username
                if (!namecontent) {
                    creatorUsername.innerHTML = `@_______`
                } else {
                    creatorUsername.textContent = `@${namecontent}`
                }


            })   
        });
    }
    displayimage()


    // Picture display modal close btn
    document.getElementById(`closemodal`).addEventListener(`click`, () => {
        picturedisplay.style.display = `none`
    })

    // Function that collect homepage category textcontent
    function getcontent() {
        category.forEach(element => {
            element.addEventListener(`click`, async () => {
                const elementcontent = element.querySelector("p").textContent
                if (!elementcontent) return
                
                try {
                    const response = await fetchImage(elementcontent)
                    displayimage(response)
                    
                } catch (error) {
                    console.error(`Image URL can't be found`)
                }
                
            })
        })
    }
    getcontent()

    async function loadDefaultImages() {
        const keyword = `Random and Lifestyle pictures`
        const response = await fetchImage(keyword)
        displayimage(response)
        
    }
    loadDefaultImages()

    // Create New Category Input Functionalities
    const addCategoryBtn = document.getElementById(`addcategory`)
    const categoryform = document.querySelector(`.categoryform`)

    addCategoryBtn.addEventListener(`click`, () => {
        categoryform.style.display = `flex`
    })

    document.querySelector(`.closediv`).addEventListener(`click`, () => {
        categoryform.style.display = `none`
    })

    // 
    const submitCategoryBtn = document.getElementById(`submitBtn`)
    const inputvalue = document.getElementById(`collectioninput`)
    const errroralert = document.getElementById(`erroralert`)
    const categoryContainer = document.querySelector(`.newcategorycontainer`)

    // Submit Collections Button Event Listeners
    submitCategoryBtn.addEventListener(`click`, () => {
        const inputValue = inputvalue.value.trim()
        // const uniqueId = `id` + Date.now()
        const isvalid = verifyinput(inputvalue, errroralert)
        if (!isvalid) {
        return
        }
        categoryform.style.display = "none";

        const elementinput = {
            id: Date.now(),
            categoryinput: inputValue
        }
        arrayelement.push(elementinput)
        console.log(arrayelement)
        submitelement()
        getelement()
        inputvalue.value = ""
    })

    // Verify input as text value only
    function verifyinput(input, error) {
        const rerexvalue = `^([^0-9]*)$`

        const value = input.value.trim()
            
        if (!value.trim()) {
            input.style.border = `1.5px solid black`
            error.textContent = `A collection name is required`
            error.style.color = `gray`
            return false
        } else if (!value.match(rerexvalue)) {
            input.style.border = `1.5px solid red`
            error.textContent = `A collection name must be alphabet (A-Z) only`
            error.style.color = `red`
            return false
        }
        else {
            input.style.border = "1px solid black"
            error.textContent = ""
            return true
        }
    }

    // Check for function on input event listeners
    inputvalue.addEventListener("input", () => {
        verifyinput(inputvalue, errroralert)
    })

    // Submit to local storage
    function submitelement() {
        localStorage.setItem(`arrayElement`, JSON.stringify(arrayelement)) 
    }

    // Fetch items
    function getelement() {
        const storedata = localStorage.getItem(`arrayElement`)
        itemtofetch = JSON.parse(storedata)
        categoryContainer.innerHTML = "";
        itemtofetch.forEach((item) => {
            const divelement = document.createElement(`div`)
            divelement.classList.add(`category`, `category2`)
            divelement.innerHTML = `<p>${item.categoryinput}</p> <span data-id ="${item.id}"class="material-symbols-outlined">close</span> `

            // append a child
            categoryContainer.appendChild(divelement)
            divelement.addEventListener("click", () => {
            const categoryName = divelement.querySelector("p").textContent.trim();

            fetchImage(categoryName)
            .then(data => displayimage(data));
            });
        })

    }
    getelement()

    categoryContainer.addEventListener(`click`, (e) => {
        if (e.target.tagName === "SPAN") {
            const targetID = parseInt(e.target.getAttribute("data-id"))
            console.log(targetID)
            arrayelement = arrayelement.filter(element => element.id !== targetID)
            submitelement()
            loadDefaultImages()
            getelement()
        }
    })

    // Get list suggestion and add it as the input value
    const listsuggestion = document.querySelectorAll(`.list`)
    console.log(listsuggestion)

    listsuggestion.forEach((element) => {
        console.log(element)
        element.addEventListener(`click`, () => {
            const paragraph = element.querySelector("p").textContent.trim()
            inputvalue.value = paragraph
        })
        
    })

})