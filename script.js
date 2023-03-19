document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById('form-gerar-query');
  const descricaoInput = document.getElementById('descricao');
  const btnGerar = document.getElementById('btn-gerar');
  const btnCopiar = document.getElementById('btn-copiar');
  const respostaTextarea = document.getElementById('resposta');
  const gif = document.getElementById("gif");

    // Função para exibir o modal de carregamento
    function showLoading() {
      var overlay = document.getElementById('overlay');
			var loading = document.getElementById('loading');
			overlay.style.display = 'block';
			loading.style.display = 'block';
    }

    function hideLoading() {
			var overlay = document.getElementById('overlay');
			var loading = document.getElementById('loading');
			overlay.style.display = 'none';
			loading.style.display = 'none';
		}


  btnGerar.addEventListener('click', (e) => {
    e.preventDefault();
    showLoading();
    const i_descricao = descricaoInput.value.trim();
    if (i_descricao === '') {
      return;
    }
    const url = `https://api.openai.com/v1/completions`;
    const apiKey = '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';
    
    const data = {
      "model": "text-davinci-003",
      "prompt": `explique o que é o erro abaixo:\n\n ${i_descricao}`,
      "temperature": 1,
      "max_tokens": 2000
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(data)
    };
    fetch(url, options)
      .then(response => {
        console.log(response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Erro ao interpretar o erro.');
        }
      })
      .then(result => {
        console.log(result);
        const generatedQuery = result.choices[0].text;
        respostaTextarea.value = generatedQuery; // atualiza o valor do campo de resposta com a resposta da API
        btnCopiar.disabled = false;
      })
      .catch(error => console.log('Error:', error.message))
      .finally(() => {
        hideLoading(); // chama a função para esconder o modal de carregamento
      });
  });
  
  document.getElementById('btn-copiar').addEventListener('click', () => {
    const content = respostaTextarea.value;
    if (content === '') {
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    document.getElementById('btn-copiar').textContent = 'Copiado!';
  });

  
  form.addEventListener('input', () => {
    if (descricaoInput.value.trim() !== '') {
      btnGerar.disabled = false;
    } else {
      btnGerar.disabled = true;
    }
    });
  });
