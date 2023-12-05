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
            <h1>Novo Conteúdo</h1>
        `;

        // Adicione o novo conteúdo ao corpo da página e aplique a classe show
        document.body.appendChild(newContent);
        setTimeout(() => {
            newContent.classList.add('show');
        }, 10); // Um pequeno atraso para garantir que a classe 'display: none' seja aplicada antes da 'opacity'
    }
});
