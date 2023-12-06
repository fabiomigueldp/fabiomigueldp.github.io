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
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Fábio Miguel's Portfolio</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
        
        <header class="header">
            <img src="profile-icon.png" alt="Fábio Miguel" class="profile-icon">
            <div class="title-container">
                <h1>Fábio Miguel</h1>
                <p>Under-graduated student majoring in Computer Science.</p>
            </div>
        </header>
        
        <nav class="navigation">
            <a href="https://github.com" class="nav-link">GitHub</a>
            <a href="https://linkedin.com" class="nav-link">Linked-In</a>
            <a href="mailto:your@email.com" class="nav-link">Mail-to</a>
            <a href="https://instagram.com" class="nav-link">Instagram</a>
            <a href="https://discord.com" class="nav-link">Discord</a>
        </nav>
        
        <main class="main-content">
            <section class="content-section"></section>
            <aside class="sidebar">
                <div class="github-stats">
                    <img src="https://github-readme-stats.vercel.app/api?username=fabiomigueldp&show_icons=true" alt="fabiomigueldp" class="github-stats-img">
                </div>    </aside>
        </main>
        </body>
        </html>
        
        
        `;

        // Adicione o novo conteúdo ao corpo da página e aplique a classe show
        document.body.appendChild(newContent);
        setTimeout(() => {
            newContent.classList.add('show');
        }, 10); // Um pequeno atraso para garantir que a classe 'display: none' seja aplicada antes da 'opacity'
    }
});
