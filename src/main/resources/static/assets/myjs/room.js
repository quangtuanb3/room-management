const roomForm = document.getElementById('roomForm');
const eCheckBoxCategories = document.getElementsByName('categories');
const eSelectType = document.getElementById('type');
const ePagination = document.getElementById('pagination')
const eSearch = document.getElementById('search');
const tBody = document.getElementById("tBody");
const eHeaderPrice = document.getElementById("header-price");
const eModalTitle = document.getElementById("staticBackdropLabel");
const submitBtn = document.getElementById("submit-btn");
const eOptionsType = eSelectType.querySelectorAll("option");
const ePriceSelectSearch = document.getElementById("PriceSelectSearch");
let roomDetail;
let pageable = {
    page: 1,
    sort: 'id,desc',
    priceStart: 0,
    priceEnd: 50000000,
    search: ''
}
roomForm.onsubmit = async (e) => {
    e.preventDefault();
    let data = getDataFromForm(roomForm);
    data = {
        ...data,
        type: {
            id: data.type
        },
        idCategories: Array.from(eCheckBoxCategories)
            .filter(e => e.checked)
            .map(e => e.value)
    }
    if (data.id) {
        await callEditAPI(data);
    } else {
        await callCreateAPI(data);
    }


}

async function callCreateAPI(data) {
    const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (res.ok) {
        alert('Created');
        getList();
        $('#staticBackdrop').modal('hide');
    }
}

function getDataFromForm(form) {
    // event.preventDefault()
    const data = new FormData(form);
    return Object.fromEntries(data.entries())
}

async function getList() {
    let url = `/api/rooms?page=${pageable.page - 1 || 0}&sort=${pageable.sortCustom || 'id,desc'}&search=${pageable.search || ''}&priceStart=${pageable.priceStart || ''}&priceEnd=${pageable.priceEnd || ''}`;
    console.log(url);
    const response = await fetch(url);
    const result = await response.json();
    pageable = {
        ...pageable,
        ...result
    };
    genderPagination();
    renderTBody(result.content);
    //result tra ve data type map voi ben RestController
}

const genderPagination = () => {
    ePagination.innerHTML = '';
    let str = '';

    const pagesToShow = 5; // Number of pages to display

    const startPage = Math.max(1, pageable.page - 2); // Calculate the start page
    const endPage = Math.min(pageable.totalPages, startPage + pagesToShow - 1); // Calculate the end page

    // Generate "Previous" button
    str += `<li class="page-item ${pageable.first ? 'disabled' : ''}">
              <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
            </li>`;

    // Generate page numbers
    for (let i = startPage; i <= endPage; i++) {
        str += `<li class="page-item ${(pageable.page) === i ? 'active' : ''}" aria-current="page">
                  <a class="page-link" href="#">${i}</a>
                </li>`;
    }

    // Generate "Next" button
    str += `<li class="page-item ${pageable.last ? 'disabled' : ''}">
              <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Next</a>
            </li>`;

    ePagination.innerHTML = str;

    const ePages = ePagination.querySelectorAll('li');
    const ePrevious = ePages[0];
    const eNext = ePages[ePages.length - 1];

    ePrevious.onclick = () => {
        if (pageable.page === 1) {
            return;
        }
        pageable.page -= 1;
        getList();
    };

    eNext.onclick = () => {
        if (pageable.page === pageable.totalPages) {
            return;
        }
        pageable.page += 1;
        getList();
    };

    for (let i = 1; i < ePages.length - 1; i++) {
        if (i === pageable.page) {
            continue;
        }
        ePages[i].onclick = () => {
            pageable.page = i;
            getList();
        };
    }
};
window.onload = () => {
    getList();
    onLoadSort();

}
const onLoadSort = () => {
    eHeaderPrice.onclick = () => {
        let sort = 'price,desc'
        if (pageable.sortCustom?.includes('price') && pageable.sortCustom?.includes('desc')) {
            sort = 'price,asc';
        }
        pageable.sortCustom = sort;
        getList();
    }
}

function renderTBody(items) {
    let str = '';
    items.forEach(e => {
        str += renderItemStr(e);
    })
    tBody.innerHTML = str;
}

function renderItemStr(item) {
    return `<tr>
                    <td>
                        ${item.id}
                    </td>
                    <td title="${item.description}">
                        ${item.name}
                    </td>
                    <td>
                        ${item.price}
                    </td>
                    <td>
                        ${item.type}
                    </td>
                    <td>
                        ${item.roomCategories}
                    </td>
                    <td>
                         <div class="dropdown">
                             <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                             <i class="bx bx-dots-vertical-rounded"></i>
                            </button>
                        <div class="dropdown-menu">
                        <button class="dropdown-item" onclick="showEdit(${item.id})"
                        data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                        ><i class="bx bx-edit-alt me-1"></i> Edit</button>
                        <button class="dropdown-item" 
                        onclick='if (confirm("Are you sure?")) { deleteRoom(${item.id}); }'>
                        <i class="bx bx-trash me-1"></i> Delete
                        </button>

              </div>
            </div>
                    </td>
                </tr>`
}


function renderForm(roomDetail) {
    if (roomDetail) {
        eModalTitle.innerText = "Edit Room";
        submitBtn.innerText = "Save change"
        $('#type').val(roomDetail.typeId).trigger('change');

        Array.from(eCheckBoxCategories).forEach((item) => {
            if (roomDetail.roomCategoryIds.includes(parseInt(item.value))) {
                item.checked = true;
            }
        });

    } else {
        eModalTitle.innerText = "Create Room";
        submitBtn.innerText = "Create now"
        eOptionsType.forEach((item) => {
            item.selected = false;
        });
        eCheckBoxCategories.forEach((item) => {
            item.checked = false;
        });
    }
    roomForm.id.value = roomDetail?.id || "";
    roomForm.name.value = roomDetail?.name || "";
    roomForm.description.value = roomDetail?.description || "";
    roomForm.price.value = roomDetail?.price || "";


}

async function showEdit(id) {
    try {
        const response = await fetch(`/api/rooms/${id}`); // Replace with your API endpoint
        if (response.ok) {
            roomDetail = await response.json();
            renderForm(roomDetail);
            // Open the modal or form for editing (you may have your own code for this)
        } else {
            // Handle error
        }
    } catch (error) {
        console.error(error);
    }
}

async function callEditAPI(data) {
    const res = await fetch(`/api/rooms/${data.id}`, { // Replace with your API endpoint for updating a film by ID
        method: 'PUT', // Use the appropriate HTTP method for updating (e.g., PUT or PATCH)
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert("Updated");
        await getList();
    } else {
        alert("Something went wrong!")
    }

    $('#staticBackdrop').modal('hide');
}

async function deleteRoom(id) {
    const res = await fetch(`/api/rooms/${id}`, { // Replace with your API endpoint for updating a film by ID
        method: 'DELETE', // Use the appropriate HTTP method for updating (e.g., PUT or PATCH)
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(id)
    });

    if (res.ok) {
        alert("Deleted");
        await getList();
    } else {
        alert("Something went wrong!")
    }

}

const onSearch = (e) => {
    e.preventDefault()
    pageable.search = eSearch.value;
    getList();
}

ePriceSelectSearch.onchange = () => {
    let [min, max] = ePriceSelectSearch.value.split("-");
    pageable.priceStart = min;
    pageable.priceEnd = max;
    getList();
}