(async () => {
    const bodyname = document.body.dataset.name;
    
    const fetched = await fetch(`https://ice1botmaker.github.io/ICe1BotMaker/posts.json`);
    const posts = await fetched.json();
    
    if (bodyname === `main`) {
        document.querySelector(`.items`).innerHTML = ``;
        posts.forEach(post => {
            document.querySelector(`.items`).innerHTML += `
            <div class="item" onclick="location.href = '/detail.html?id=${post.id}';">
                <div class="item-image">
                    <img src="${post.image}" alt="item-image">
                </div>

                <div class="item-content">
                    <p class="item-content-title">${post.title}</p>
                    <p class="item-content-description">${post.description}</p>
                </div>
            </div>`;
        });
    } else if (bodyname === `detail`) {
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
                    const modal = document.querySelector(`#SearchModalBackground`);
                    modal.style.display = `flex`;
                    modal.querySelector(`#search`).value = category;
                    modal.querySelector(`#search`).oninput();
                }
            });

            document.querySelector(`.side-menu-items`).innerHTML = ``;
            post.index.forEach(index => document.querySelector(`.side-menu-items`).innerHTML += `<div class="side-menu-item"><a href="${index.link}">${index.name}</a></div>`);
        }
    }

    const modal = document.querySelector(`#SearchModalBackground`);
    const modalItems = modal.querySelector(`.modal-items`);
    const modalText = modal.querySelector(`.modal-text`);

    document.querySelector(`.header-item.search`).onclick = () => modal.style.display = `flex`;
    modal.querySelector(`.modal-close`).onclick = () => modal.style.display = `none`;

    modal.querySelector(`#search`).oninput = () => {
        const items = [];

        modalItems.innerHTML = ``;

        posts.forEach(post => {
            modal.querySelector(`#search`).value.split(``).forEach(text => {
                if (post.title.split(``).concat(post.categories.reduce((pre, cur) => pre.concat(cur.split(``)), [])).includes(text.trim()) && !items.includes(post)) {
                    items.push(post);
                    modalItems.innerHTML += `
                    <div class="modal-item" onclick="location.href = '/detail.html?id=${post.id}';">
                        <p class="modal-item-title">${post.title}</p>
                        <p class="modal-item-description">${post.description}</p>
                    </div>`;
                }
            });
        });

        modalText.innerHTML = `${items.length}개의 게시글을 찾았어요.`;
    }
})();