import {useState} from "react";
import {Link, useParams} from "react-router-dom";
import api from '../../services/api'


function extrairMensagemErro(error) {
    if (error.response && error.response.data) {
        const campos = Object.keys(error.response.data)
        if (campos.length > 0) {
            const primeiroCampo = campos[0]
            return error.response.data[primeiroCampo][0]
        }
    }
    return 'Algo deu errado. Tente novamente mais tarde.'
}

function validarSenhas(senha, confirmacao) {
    if (!senha.trim()) {
        return 'Informe a nova senha.'
    }
    if (senha !== confirmacao) {
        return 'As senhas não coincidem.'
    }
    return null
}

export default function RedSenha() {
    const {uid, token} = useParams()
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');


    async function handleSubmit(e) {
        e.preventDefault()

        const erroValidacao = validarSenhas(novaSenha, confirmarSenha)
        if (erroValidacao) {
            setStatus('error')
            setErrorMessage(erroValidacao)
            return
        }

        setStatus('loading')
        setErrorMessage('')

        try {
            await api.post('/api/usuarios/confirmar-redefinicao-senha/', {
                uid,
                token,
                nova_senha: novaSenha,
                confirmar_senha: confirmarSenha,
            })
            setStatus('success')
        } catch (error) {
            console.log(error.response?.data) // remover depois de debugar
            setStatus('error')
            setErrorMessage(extrairMensagemErro(error))
        }
    }

    if (status === 'success') {
        return (
            <div>
                <h1>Senha redefinida!</h1>
                <p>Sua senha foi alterada com sucesso. Faça login novamente com a nova senha.</p>
                <Link to={'/login'}> Ir para o login</Link>
            </div>
        )
    }

    return (
        <div>
            <h1>Criar nova senha</h1>
            <p>Digite sua nova senha abaixo.</p>

            <form onSubmit={handleSubmit}>
                <label htmlFor="novaSenha">Nova senha</label>
                <input
                    id="novaSenha"
                    type="password"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    disabled={status === "loading"}
                    autoComplete="new-password"
                />

                <label htmlFor="confirmarSenha">Confirmar nova senha</label>
                <input
                    id="confirmarSenha"
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    disabled={status === "loading"}
                    autoComplete="new-password"
                />

                {status === "error" && (
                    <p role="alert" style={{color: "red"}}>
                        {errorMessage}
                    </p>
                )}

                <button type="submit" disabled={status === "loading"}>
                    {status === "loading" ? "Salvando..." : "Redefinir senha"}
                </button>
            </form>
        </div>
    )
}