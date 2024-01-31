(async () => {
    const bodyname = document.body.dataset.name;
    
    const fetched = await fetch(`https://ice1botmaker.github.io/ICe1BotMaker/posts.json`);
    const posts = await fetched.json();
    
    if (bodyname === `main`) {
        const page = Number(new URLSearchParams(location.search).get(`page`)) || 1;

        document.querySelector(`.items`).innerHTML = ``;
        for (let i = ((page * 8) - 8); i < (page * 8); i++) {
            if (posts[i]) document.querySelector(`.items`).innerHTML += `
            <div class="item" onclick="location.href = '/ICe1BotMaker/view.html?id=${posts[i].id}';">
                <div class="item-image">
                    <img src="${posts[i].image}" alt="item-image">
                </div>

                <div class="item-content">
                    <p class="item-content-title">${posts[i].title}</p>
                    <p class="item-content-description">${posts[i].description}</p>
                </div>
            </div>`;
        }

        const pagenationStart = document.querySelector(`.pagenation-start`);
        const pagenationPrev = document.querySelector(`.pagenation-prev`);
        const pagenationNext = document.querySelector(`.pagenation-next`);
        const pagenationEnd = document.querySelector(`.pagenation-end`);

        pagenationStart.onclick = () => location.href = `?page=1`;
        pagenationPrev.onclick = () => { if (page > 1) location.href = `?page=${page - 1}`; }
        pagenationNext.onclick = () => { if (page < Math.ceil(posts.length / 8)) location.href = `?page=${page + 1}`; }
        pagenationEnd.onclick = () => location.href = `?page=${Math.ceil(posts.length / 8)}`;
    } else if (bodyname === `view`) {
        const id = new URLSearchParams(location.search).get(`id`);
        const post = posts[id];
    
        if (!id || !post) location.href = `/`;
        else {
            const converter = new showdown.Converter();
            const text = post.content;
            const html = converter.makeHtml(text);
            
            document.title = post.title;
            document.querySelector(`#keywords`).content = post.title;
            document.querySelector(`#description`).content = post.description;

            document.querySelector(`.markdown`).innerHTML = html;
            document.querySelector(`.sub-visual-content-title`).innerHTML = `💫 ${post.title}`;
            document.querySelector(`.sub-visual-content-description`).innerHTML = post.description.replace(/\n/g, `<br>`);
            document.querySelector(`.sub-visual-content-category`).innerHTML = post.categories.join(`, `);

            document.querySelector(`.tags`).innerHTML = ``;
            post.tags.forEach((tag, idx) => document.querySelector(`.tags`).innerHTML += `<div class="tag tag-${idx}">${tag}</div>`);
            post.tags.forEach((tag, idx) => {
                document.querySelector(`.tag-${idx}`).onclick = () => {
                    location.href = `/ICe1BotMaker/tag.html?tag=${tag}`;
                }
            });

            document.querySelector(`.side-menu-items`).innerHTML = ``;
            post.index.forEach(index => document.querySelector(`.side-menu-items`).innerHTML += `<div class="side-menu-item"><a href="${index.link}">${index.name}</a></div>`);
        }
    } else if (bodyname === `tag`) {
        const tag = new URLSearchParams(location.search).get(`tag`);

        if (!tag) location.href = `/`;
        else {
            const page = Number(new URLSearchParams(location.search).get(`page`)) || 1;
            const filtered = posts.filter(e => e.tags.includes(tag));

            if (filtered.length > 0) {
                document.querySelector(`.items`).innerHTML = ``;
                for (let i = ((page * 8) - 8); i < (page * 8); i++) {
                    if (filtered[i]) document.querySelector(`.items`).innerHTML += `
                    <div class="item" onclick="location.href = '/ICe1BotMaker/view.html?id=${filtered[i].id}';">
                        <div class="item-image">
                            <img src="${filtered[i].image}" alt="item-image">
                        </div>
        
                        <div class="item-content">
                            <p class="item-content-title">${filtered[i].title}</p>
                            <p class="item-content-description">${filtered[i].description}</p>
                        </div>
                    </div>`;
                }
        
                const pagenationStart = document.querySelector(`.pagenation-start`);
                const pagenationPrev = document.querySelector(`.pagenation-prev`);
                const pagenationNext = document.querySelector(`.pagenation-next`);
                const pagenationEnd = document.querySelector(`.pagenation-end`);
        
                pagenationStart.onclick = () => location.href = `?tag=${tag}&page=1`;
                pagenationPrev.onclick = () => { if (page > 1) location.href = `?tag=${tag}&page=${page - 1}`; }
                pagenationNext.onclick = () => { if (page < Math.ceil(filtered.length / 8)) location.href = `?tag=${tag}&page=${page + 1}`; }
                pagenationEnd.onclick = () => location.href = `?tag=${tag}&page=${Math.ceil(filtered.length / 8)}`;
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