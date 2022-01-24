import { useState, useEffect } from 'react'
import * as yup from 'yup'

let schema = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  birthDate: yup.date().typeError('Birthdate must be a valid date'),
  emailConsent: yup.bool().oneOf([true], 'Must agree to being contacted via email')
})

const initialFormValues = {
  name: '',
  email: '',
  birthDate: '',
  emailConsent: false
}

function ContactForm() {
  const [details, setDetails] = useState(initialFormValues)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState(false)

  const emptyDetails = details.name === '' && details.email === '' && details.birthDate === '' && details.emailConsent === false

  // updates errors in real time
  useEffect(() => {
    if (!emptyDetails) {
      schema.validate(details)
        .then(() => setError(''))
        .catch(err => setError(err.errors[0]))
    }
  }, [details])
  
  const changeHandler = e => {
    setDetails({ ...details, [e.target.name]: e.target.value })
  }

  const submitHandler = async e => {
    e.preventDefault()

    schema.validate(details)
      .then(() => {
        setError('')
        fetch('https://my-json-server.typicode.com/JustUtahCoders/interview-users-api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(details)
        }).then(res => {
          // summons success message for 4 seconds
          if (res.status === 201) {
            setSuccessMessage(true)
            setTimeout(() => setSuccessMessage(false), 4000)
          }
        })
      })
      .catch(err => setError(err.errors[0]))
  }

  // this toggles the value of emailConsent when the checkbox is modified
  const emailConsentHandler = () => {
    details.emailConsent ?
    setDetails({ ...details, emailConsent: false }) :
    setDetails({ ...details, emailConsent: true })
  }

  const clear = () => {
    setDetails(initialFormValues)
    setError(false)
  }

  return (
    <>
      <form onSubmit={submitHandler}>

        <div className='form-group title'>
          <h2>Contact Us</h2>
        </div>

        {successMessage && (
          <div className='form-group success'>
            <div>Success!</div>
          </div>
        )}

        {error && (
          <div className='form-group error'>
            <div>{error}</div>
          </div>
        )}

        <div className='form-group'>
          <label htmlFor='name'>Name: </label>
          <br />
          <input type="text" name="name" id="name" placeholder="Dale" onChange={changeHandler} value={details.name} />
        </div>

        <div className='form-group'>
          <label htmlFor='email'>Email: </label>
          <br />
          <input type="email" name="email" id="email" placeholder="myemail@email.com" onChange={changeHandler} value={details.email} />
        </div>

        <div className='form-group'>
          <label htmlFor='birthDate'>Birthdate: </label>
          <br />
          <input type="date" name="birthDate" id="birthDate" onChange={changeHandler} value={details.birthDate} />
        </div>

        <div className='form-group email-consent'>
          <input type="checkbox" name="emailConsent" id="emailConsent" onChange={emailConsentHandler} checked={details.emailConsent} />
          <label htmlFor='emailConsent'>I agree to be contacted via email</label>
        </div>

        <div className='form-group buttons'>
          <input type="submit" name="submit" id="submit" value="submit" disabled={error || emptyDetails} />
          <input type="button" name="clear" id="clear" onClick={clear} value="clear" />
        </div>

      </form>

      <style jsx>{`
      /* I'm only using the root because this form is the ony thing on the site */
        #root {
          display: flex;
          justify-content: center;
        }
        form {
          display: flex;
          flex-direction: column;
          min-width: 55vh;
          min-height: 70vh;
          margin-top: 10vh;
          background-color: #ededed;
          font-family: sans-serif;
        }
        label {
          margin-bottom: 7px;
        }
        input {
          border: none;
          outline: none;
          height: 5vh;
          padding-left: 5px;
        }
        input:focus {
          outline: 2px solid grey;
        }
        .form-group {
          margin: 2vh 5vh;
          display: flex;
          flex-direction: column;
        }
        .title {
          margin-bottom: 0vh;
        }
        .email-consent, .buttons {
          display: flex;
          flex-direction: row;
        }
        .email-consent input {
          height: 13px;
          margin-right: 10px;
        }
        .buttons {
          flex-direction: row-reverse;
          margin-top: 2vh;
        }
        .buttons input {
          padding: 0px 10px;
          height: 35px;
          cursor: pointer;
          border: 2px solid grey;
          margin-right: 3vh;
        }
        .success, .error {
          margin-top: 0px;
          margin-bottom: 0px;
        }
        .success {
          color: green;
        }
        .error {
          color: red;
        }
      `}</style>
    </>
  )
}

export default ContactForm
