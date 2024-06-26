// transition.js

document.addEventListener('DOMContentLoaded', (event) => {
    // Seu botão
    const portfolioButton = document.querySelector('#portfolioButton');

    // Ação de clique no botão
    portfolioButton.addEventListener('click', (e) => {
        e.preventDefault();

        // Selecionar o conteúdo existente e aplicar a classe fade-out
        const content = document.getElementById('content');
        content.classList.add('fade-out');

        // Aguardar o fim da transição
        content.addEventListener('transitionend', () => {
            content.style.display = 'none';
            showNewContent();
        }, { once: true });
    });

    // Função para exibir o novo conteúdo
    function showNewContent() {
        // Crie o novo conteúdo aqui ou revele o conteúdo que já está na página, mas inicialmente escondido
        const newContent = document.createElement('div');
        newContent.classList.add('new-content');
        newContent.innerHTML = `
        <header class="header">
            <img src="owner51.jpg" alt="Fábio Miguel" class="profile-icon">
            <div class="title-container">
                <h1>Fábio Miguel</h1>
                <p>Under-graduated student majoring in Computer Science.</p>
                <p>Feel free to reach out to me on Discord at fabiomigueldp if you have any questions or want to chat!</p>
            </div>
        </header>
        
        <nav class="navigation">
            <a href="https://github.com/fabiomigueldp" class="nav-link">GitHub</a>
            <a href="https://fabiomigueldp.github.io" class="nav-link">GitHub.io</a>
            <a href="https://www.linkedin.com/in/fábio-miguel-428270239/" class="nav-link">Linked-In</a>
            <a href="mailto:fabiomigueldp@gmail.com" class="nav-link">Mail-to</a>
            <a href="https://www.instagram.com/fabiomigueldp/" class="nav-link">Instagram</a>
            <a href="https://torbware.space" class="nav-link">Torbware</a>
        </nav>
        
        <main class="main-content">
            <section class="content-section">
                <article>
                <img src="chat.svg" alt="Ícone de Chat" id="chat-svg">
                </article>
            </section>
            <aside class="sidebar">
                <div class="github-stats">
                    <img alt="GitHub Stats" src="https://github-readme-stats.vercel.app/api?username=fabiomigueldp&theme=synthwave&show_icons=true&hide_border=true&count_private=true" class="github-stats-img" />
                    <img alt="GitHub Streak" src="https://github-readme-streak-stats.herokuapp.com/?user=fabiomigueldp&theme=synthwave&hide_border=true" class="github-stats-img"/>
                    <img alt="Top Languages" src="https://github-readme-stats.vercel.app/api/top-langs/?username=fabiomigueldp&theme=synthwave&show_icons=true&hide_border=true&layout=compact" class="github-stats-img"/>
                </div>
            </aside>
        </main>
        <footer>    
        </footer>
        `;

        // Adicione o novo conteúdo ao corpo da página e aplique a classe show
        document.body.appendChild(newContent);
        setTimeout(() => {
            newContent.classList.add('show');
        }, 10); // Um pequeno atraso para garantir que a classe 'display: none' seja aplicada antes da 'opacity'
    }
});
