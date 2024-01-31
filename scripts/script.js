(async () => {
    const bodyname = document.body.dataset.name;
    
    const fetched = await fetch(`https://ice1botmaker.github.io/ICe1BotMaker/posts.json`);
    const posts = await fetched.json();
    
    if (bodyname === `main`) {
        document.querySelector(`.items`).innerHTML = ``;
        posts.forEach(post => {
            document.querySelector(`.items`).innerHTML += `
            <div class="item" onclick="location.href = '/ICe1BotMaker/view.html?id=${post.id}';">
                <div class="item-image">
                    <img src="${post.image}" alt="item-image">
                </div>

                <div class="item-content">
                    <p class="item-content-title">${post.title}</p>
                    <p class="item-content-description">${post.description}</p>
                </div>
            </div>`;
        });
    } else if (bodyname === `view`) {
        const id = new URLSearchParams(location.search).get(`id`);
        const post = posts[id];
    
        if (!id || !post) location.href = `/`;
        else {
            const converter = new showdown.Converter();
            const text = post.content;
            const html = converter.makeHtml(text);
            
            document.querySelector(`.markdown`).innerHTML = html;
            document.querySelector(`.sub-visual-content-title`).innerHTML = `💫 ${post.title}`;
            document.querySelector(`.sub-visual-content-description`).innerHTML = post.description.replace(/\n/g, `<br>`);

            document.querySelector(`.categories`).innerHTML = ``;
            post.categories.forEach((category, idx) => document.querySelector(`.categories`).innerHTML += `<div class="category category-${idx}">${category}</div>`);
            post.categories.forEach((category, idx) => {
                document.querySelector(`.category-${idx}`).onclick = () => {
                    location.href = `/ICe1BotMaker/category.html?category=${category}`;
                }
            });

            document.querySelector(`.side-menu-items`).innerHTML = ``;
            post.index.forEach(index => document.querySelector(`.side-menu-items`).innerHTML += `<div class="side-menu-item"><a href="${index.link}">${index.name}</a></div>`);
        }
    } else if (bodyname === `category`) {
        const category = new URLSearchParams(location.search).get(`category`);

        if (!category) location.href = `/`;
        else {
            const filtered = posts.filter(e => e.categories.includes(category));

            if (filtered.length > 0) {
                document.querySelector(`.items`).innerHTML = ``;
                filtered.forEach(post => {
                    document.querySelector(`.items`).innerHTML += `
                    <div class="item" onclick="location.href = '/ICe1BotMaker/view.html?id=${post.id}';">
                        <div class="item-image">
                            <img src="${post.image}" alt="item-image">
                        </div>
    
                        <div class="item-content">
                            <p class="item-content-title">${post.title}</p>
                            <p class="item-content-description">${post.description}</p>
                        </div>
                    </div>`;
                });
            } else {
                document.querySelector(`.items`).innerHTML = `카테고리 검색 결과가 없습니다.`;
            }
        }
    }

    const modal = document.querySelector(`#SearchModalBackground`);
    const modalItems = modal.querySelector(`.modal-items`);
    const modalText = modal.querySelector(`.modal-text`);

    document.querySelector(`.header-item.search`).onclick = () => modal.style.display = `flex`;
    modal.querySelector(`.modal-close`).onclick = () => modal.style.display = `none`;

    modal.querySelector(`#search`).oninput = () => {
        const searchTerm = modal.querySelector(`#search`).value.toLowerCase();
        const items = [];
    
        modalItems.innerHTML = ``;
    
        posts.forEach(post => {
            const titleLower = post.title.toLowerCase();
            const contentLower = post.content.toLowerCase();
    
            if (titleLower.includes(searchTerm) || contentLower.includes(searchTerm)) {
                items.push(post);
    
                const highlightedTitle = post.title.replace(new RegExp(`(${searchTerm})`, 'gi'), (_, p1) => `<span class="highlight">${p1}</span>`);
                const highlightedDescription = post.description.replace(new RegExp(`(${searchTerm})`, 'gi'), (_, p1) => `<span class="highlight">${p1}</span>`);
    
                modalItems.innerHTML += `
                <div class="modal-item" onclick="location.href = '/ICe1BotMaker/view.html?id=${post.id}';">
                    <p class="modal-item-title">${highlightedTitle}</p>
                    <p class="modal-item-description">${highlightedDescription}</p>
                </div>`;
            }
        });
    
        modalText.innerHTML = `${items.length}개의 게시글을 찾았어요.`;
    }
})();