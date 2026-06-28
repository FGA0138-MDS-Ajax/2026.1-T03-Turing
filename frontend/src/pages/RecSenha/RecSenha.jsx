// essa vai ser a tela de colocar o email e ter o botao de enviar link
import {useState} from 'react'
import api from '../../services/api'


function validadeEmail(value) {
    if (!value.trim()) {
        return 'Informe seu email.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Informe um email válido.'
    }
    return null
}

export default function Rec_senha() {
    const [email, setEmail] = useState("");
    // status: 'idle' | 'loading' | 'success' | 'error'
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const RecSenha_endpoint = '/api/usuarios/recuperar-senha/'


    async function submitEmail(emailP) {
        emailP.preventDefault()


        setStatus('loading')
        setErrorMessage('')

        try {
            const validacaoEmail = validadeEmail(email)
            if (validacaoEmail) {
                setStatus('error')
                setErrorMessage(validacaoEmail)
                return
            }
            const response = await api.post(RecSenha_endpoint, {email})
            if (response.status !== 200) {
                throw new Error('Erro ao enviar email')
            }
            setStatus('success')
        } catch (error) {
            setStatus('error')
            setErrorMessage(error.message || 'Erro desconhecido, tente novamente mais tarde.')
        }
        // Trata apenas erros reais de servidor/rede (500, timeout, etc).
        // Não tratamos "email não encontrado" como erro aqui de propósito:
        // o backend deve responder 200 independente de o email existir,
        // e decidir internamente se envia o link ou não.
    }


    if (status === 'success') {
        return (
            <div>
                <h1>Verifique seu email</h1>
                <p>
                    Se <strong>{email}</strong> estiver cadastrado em nossa base, você
                    receberá um link para redefinir sua senha em alguns minutos.
                </p>
                <p>Não recebeu? Verifique a caixa de spam ou tente novamente.</p>
                <button type="button" onClick={() => setStatus("idle")}>
                    Tentar com outro email
                </button>
            </div>

        )
    }

    return (
        <div>
            <h1> Esqueceu sua senha?</h1>
            <p> informe seu email e enviaremos um link pra redefinir sua senha.</p>

            <form onSubmit={submitEmail}>
                <label htmlFor={'email'}> Email</label>

                <input id="email"
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       disabled={status === "loading"}
                       placeholder="seuemail@exemplo.com"
                       autoComplete="email"/>
                {status === "error" && (
                    <p role="alert" style={{color: "red"}}>
                        {errorMessage}
                    </p>
                )}
                <button type="submit" disabled={status === "loading"}>
                    {status === "loading" ? "Enviando..." : "Enviar link de recuperação"}
                </button>
            </form>
        </div>
    )

}