# 🧪 Teste Unitário com PyUnit — Guia Completo

> **Fonte:** [DevMedia — Teste unitário com PyUnit](https://www.devmedia.com.br/teste-unitario-com-pyunit/41233)

---

## 📌 O que é PyUnit?

**PyUnit** é a biblioteca nativa do Python para escrever e executar **testes unitários**. Ela faz parte do módulo `unittest`, disponível desde o Python 2.1 — não precisa instalar nada!

É baseada na arquitetura **xUnit** (a mesma do JUnit do Java) e é a forma mais usada pela comunidade Python para testar código.

> 💡 **Teste unitário** = testar uma pequena parte do código (uma função, método ou classe) de forma isolada, garantindo que ela funciona corretamente.

---

## 📦 Instalação

Nenhuma instalação necessária! Basta importar:

```python
import unittest
# ou importar um recurso específico:
from unittest import TestCase
```

---

## ✍️ Escrevendo Testes

### Estrutura básica

Para criar testes, você cria uma **classe** que herda de `unittest.TestCase`. Os métodos de teste devem começar com o prefixo `test_`.

```python
import unittest

class MinhaClasseDeTeste(unittest.TestCase):

    def test_meu_metodo(self):
        valor_esperado = 10
        valor_real = 5 + 5
        self.assertEqual(valor_esperado, valor_real, "Os valores deveriam ser iguais!")

if __name__ == "__main__":
    unittest.main()
```

### Exemplo prático — Testando frete grátis

Imagine que você tem uma classe `Compra` com o método `frete_gratis`:

```python
# compra.py
class Compra:
    def frete_gratis(self, valor):
        return valor >= 150  # frete grátis acima de R$150
```

O teste fica assim:

```python
# test_compra.py
import unittest
from compra import Compra

class CompraTeste(unittest.TestCase):

    def test_frete_gratis(self):
        nova_compra = Compra()
        self.assertTrue(nova_compra.frete_gratis(200))  # 200 >= 150 → True ✅

if __name__ == "__main__":
    unittest.main()
```

---

## ▶️ Executando os Testes

```bash
python test_compra.py
```

**Saída esperada (sem erros):**

```
..
----------------------------------------------------------------------
Ran 2 tests in 0.001s

OK
```

Os pontinhos (`.`) representam cada teste que passou. Se houvesse falha, apareceria `F`.

---

## 🔧 Ambiente de Testes — setUp e tearDown

Quando vários testes precisam dos **mesmos objetos**, usamos os métodos especiais:

| Método | Quando executa | Para que serve |
|---|---|---|
| `setUp` | **Antes** de cada teste | Criar objetos, definir estado inicial |
| `tearDown` | **Depois** de cada teste | Fechar conexões, limpar recursos |

### Exemplo com setUp

```python
import unittest
from funcionario import Funcionario
from folha_pagamento import FolhaPagamento

class FolhaPagamentoTest(unittest.TestCase):

    def setUp(self):
        # Executado antes de cada teste
        self.funcionario = Funcionario(3000, "Cláudio Taffarel", 1, 171.9)
        self.folha = FolhaPagamento()

    def test_salario_liquido_padrao(self):
        self.assertEqual(2222.07, self.folha.calcula_salario_liquido(self.funcionario))

    def test_salario_com_tres_dependentes(self):
        self.funcionario.dependentes = 3
        self.assertEqual(2250.51, self.folha.calcula_salario_liquido(self.funcionario))
```

### Exemplo com tearDown

```python
class AnalizadorTest(unittest.TestCase):

    def setUp(self):
        self.analizador = Logger.analizador

    def test_nome_log_maiusculo(self):
        resultado = self.analizador.nome_arquivo_log_valido("log.LOG")
        self.assertTrue(resultado)

    def tearDown(self):
        self.analizador = None  # Limpa o estado após o teste
```

> ⚠️ **Dica:** Use `setUp`/`tearDown` apenas quando necessário. Eles podem tornar o código mais difícil de ler.

---

## 🎭 Objetos Mock

**Mock** é um objeto "falso" que substitui uma dependência real no teste. Isso é útil quando o código depende de algo externo (banco de dados, API, etc.) e você quer focar apenas na lógica sendo testada.

### Exemplo — Simulando uma API de câmbio

```python
# folha_pagamento.py
from api.helpers.currency import Currency

class FolhaPagamento:
    def pagamento_moeda_estrangeira(self, tipo_moeda, valor, currency: Currency):
        if tipo_moeda == Currency.QUOTACAO_DOLAR:
            return valor * currency.get_quotacao_dolar()
        elif tipo_moeda == Currency.QUOTACAO_EURO:
            return valor * currency.get_quotacao_euro()
        else:
            raise ValueError("moeda não disponível")
```

```python
# test_folha.py
import unittest
from unittest.mock import Mock, patch
from folha_pagamento import FolhaPagamento

class FolhaPagamentoTeste(unittest.TestCase):

    @patch('helpers.Currency')  # Substitui Currency por um objeto falso
    def test_pagamento_dolar(self, fake_currency):
        folha = FolhaPagamento()
        fake_currency.get_quotacao_dolar = Mock(return_value=3)  # Simula retorno R$3,00
        resultado = folha.pagamento_moeda_estrangeira("dolar", 3000, fake_currency)
        assert resultado == 9000, "valor incorreto"
```

> O `@patch` transforma `fake_currency` em um mock durante o teste e o restaura depois automaticamente.

---

## 🏗️ A Classe Mock — Principais Métodos

### Criando um Mock

```python
from unittest.mock import Mock

gateway = Mock()
gateway.recebe_pagamento.return_value = True
```

### Métodos de verificação

| Método | O que verifica |
|---|---|
| `assert_called()` | Se o mock foi chamado pelo menos uma vez |
| `assert_called_once()` | Se foi chamado exatamente uma vez |
| `assert_called_with(args)` | Se foi chamado com os parâmetros corretos na última chamada |
| `assert_called_once_with(args)` | Chamado exatamente uma vez com os parâmetros corretos |
| `assert_any_call(args)` | Se foi chamado com esses parâmetros em algum momento |
| `assert_not_called()` | Se **não** foi chamado |
| `reset_mock()` | Reseta o histórico de chamadas |

### Exemplos

```python
# Verifica se recebe_pagamento foi chamado pelo menos uma vez
def test_recebe_pagamento_pelo_menos_uma_vez(self):
    gateway = Mock()
    compra = Compra(gateway)
    compra.realiza_compra()
    gateway.recebe_pagamento.assert_called()

# Verifica se foi chamado com o valor 3000
def test_recebe_pagamento_com_valor_correto(self):
    gateway = Mock()
    compra = Compra(gateway)
    compra.realiza_compra(3000)
    gateway.recebe_pagamento.assert_called_with(3000)

# Verifica que NÃO foi chamado (ex: compra inválida)
def test_recebe_pagamento_nao_executado(self):
    gateway = Mock()
    compra = Compra(gateway)
    compra.realiza_compra(None)
    gateway.recebe_pagamento.assert_not_called()
```

### Atributos úteis do Mock

```python
gateway = Mock()
gateway.recebe_pagamento()
gateway.recebe_pagamento()

gateway.recebe_pagamento.called       # True
gateway.recebe_pagamento.call_count   # 2
gateway.recebe_pagamento.call_args    # Argumentos da última chamada
```

---

## 🃏 MagicMock

`MagicMock` é uma versão avançada de `Mock` que já tem **métodos mágicos** do Python pré-configurados (como `__str__`, `__len__`, `__getitem__`, etc.).

```python
from unittest.mock import MagicMock

lista = MagicMock()
lista.__getitem__.return_value = 42
lista[3] = "qualquer coisa"
print(lista[3])  # sempre retorna 42, independente do índice
```

### Retornos padrão do MagicMock

| Método | Retorno padrão |
|---|---|
| `__bool__` | `True` |
| `__int__` | `1` |
| `__float__` | `1.0` |
| `__len__` | `0` |
| `__contains__` | `False` |
| `__iter__` | `iter([])` |

---

## ✅ Métodos Assert — Referência Rápida

Os métodos `assert` são o coração dos testes. Eles verificam se o resultado é o esperado.

### Comparações de valores

```python
self.assertEqual(esperado, real)         # igual
self.assertNotEqual(a, b)               # diferente
self.assertTrue(expr)                   # verdadeiro
self.assertFalse(expr)                  # falso
self.assertIs(a, b)                     # mesmo objeto (tipo e valor)
self.assertIsNone(expr)                 # é None
self.assertIsNotNone(expr)              # não é None
self.assertIn(item, colecao)            # item está na coleção
self.assertIsInstance(obj, Classe)      # obj é instância da Classe
```

### Comparações numéricas

```python
self.assertGreater(a, b)        # a > b
self.assertGreaterEqual(a, b)   # a >= b
self.assertLess(a, b)           # a < b
self.assertLessEqual(a, b)      # a <= b
self.assertAlmostEqual(a, b, places=7)  # aproximadamente igual (padrão 7 decimais)
```

### Exceções e warnings

```python
# Verifica se uma exceção é lançada
self.assertRaises(TypeError, funcao, "argumento_errado")

# Usando como gerenciador de contexto
with self.assertRaises(ValueError) as ctx:
    funcao_que_deve_falhar()
    self.assertEqual(ctx.exception.error_code, 3)

# Verifica se um warning é emitido
self.assertWarns(DeprecationWarning, funcao_antiga)
```

### Coleções e strings

```python
self.assertListEqual([1, 2], [1, 2])           # listas iguais
self.assertTupleEqual((1, 2), (1, 2))          # tuplas iguais
self.assertSetEqual({1, 2}, {2, 1})            # sets iguais
self.assertDictEqual({"a": 1}, {"a": 1})       # dicionários iguais
self.assertCountEqual([1, 2, 2], [2, 1, 2])   # mesmos elementos (ignora ordem)
self.assertMultiLineEqual("texto\nlongo", "texto\nlongo")  # strings multilinha
self.assertRegex("hello world", r"hello")      # string combina com regex
```

---

## 🗺️ Fluxo Completo — Exemplo do Zero

```python
# produto.py
class Produto:
    def __init__(self, nome, preco):
        self.nome = nome
        self.preco = preco

    def aplicar_desconto(self, percentual):
        if percentual < 0 or percentual > 100:
            raise ValueError("Percentual inválido")
        return self.preco * (1 - percentual / 100)
```

```python
# test_produto.py
import unittest
from produto import Produto

class ProdutoTeste(unittest.TestCase):

    def setUp(self):
        self.produto = Produto("Notebook", 3000.00)

    def test_desconto_valido(self):
        resultado = self.produto.aplicar_desconto(10)
        self.assertAlmostEqual(2700.00, resultado, places=2)

    def test_desconto_invalido_lanca_excecao(self):
        self.assertRaises(ValueError, self.produto.aplicar_desconto, -5)

    def test_desconto_zero_mantem_preco(self):
        resultado = self.produto.aplicar_desconto(0)
        self.assertEqual(3000.00, resultado)

if __name__ == "__main__":
    unittest.main()
```

**Executar:**
```bash
python test_produto.py
```

**Saída:**
```
...
----------------------------------------------------------------------
Ran 3 tests in 0.001s

OK
```

---

## 📋 Resumo Visual

```
unittest (PyUnit)
│
├── TestCase                    ← Classe base dos seus testes
│   ├── setUp()                 ← Roda ANTES de cada teste
│   ├── tearDown()              ← Roda DEPOIS de cada teste
│   └── test_*()               ← Seus métodos de teste
│
├── Asserts                     ← Verificações
│   ├── assertEqual / assertNotEqual
│   ├── assertTrue / assertFalse
│   ├── assertRaises            ← Verifica exceções
│   ├── assertIn / assertIsInstance
│   └── ... (muitos outros)
│
└── Mock (unittest.mock)        ← Objetos falsos
    ├── Mock                    ← Mock básico
    ├── MagicMock               ← Mock com métodos mágicos
    └── @patch                  ← Decorator para mockar classes
```

---

> 📚 **Referência:** Artigo original em [DevMedia](https://www.devmedia.com.br/teste-unitario-com-pyunit/41233) por Estevão (2020).
