// essa vai ser a tela de colocar o email e ter o botao de enviar link
import {useState} from 'react'
import logo from '../../assets/minha-logo.png';
import api from '../../services/api'
import './RecSenha.css';

import { CheckCircle, Key, Mail } from 'lucide-react';

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
            <div className="request-reset-wrapper">
                <div className="request-reset-card">
                    <div className="request-reset-success">
                        <div className="success-icon">
                            <CheckCircle size={40} />
                        </div>
                        <h1 className="success-title">Verifique seu email</h1>
                        <p className="success-text">
                            Se <strong>{email}</strong> estiver cadastrado em nossa base, você
                            receberá um link para redefinir sua senha em alguns minutos.
                        </p>
                        <p className="success-note">Não recebeu? Verifique a caixa de spam ou tente novamente.</p>
                        <button type="button" className="btn-secondary" onClick={() => setStatus("idle")}>
                            Tentar com outro email
                        </button>
                    </div>
                </div>
            </div>
        );
    }
                

    return (
        <div className="request-reset-wrapper">
            <div className="request-reset-card">
               <div className="request-reset-logo">
                    <img src={logo} alt="GoStudy" className="request-reset-logo-img" />
                </div>
                <h1 className="request-reset-title"> Esqueceu sua senha?</h1>
                <p className="request-reset-subtitle"> informe seu email e enviaremos um link pra redefinir sua senha.</p>

                <form onSubmit={submitEmail} className="request-reset-form">
                    <div className="field-group">
                        <label htmlFor={'email'}> Email</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <Mail size={18} />
                            </span>

                            <input id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === "loading"}
                                placeholder="seuemail@exemplo.com"
                                autoComplete="email"/>
                        </div>
                    </div>
                    {status === "error" && (
                        <span className="error-message" role="alert">
                            {errorMessage}
                        </span>
                    )}
                    <button type="submit" className="btn-primary" disabled={status === "loading"}>
                        {status === "loading" ? "Enviando..." : "Enviar link de recuperação"}
                    </button>
                </form>
            </div>
        </div>
    );

}