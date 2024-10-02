import React from 'react'
import './ContactUs.css';

const ContactUs = () => {
    return (
        <div>
            <div>
                <section className='header-and-p'>
                    <h1 className='contactus'>Contact Us</h1>
                    <p className='someinfo'></p>
                </section>
                <section className='form-info'>
                    <div className='informations'>
                        <div className='address-title-svg'>
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-home"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>
                            <div className='address-div'>
                                <span className='address-title'>address</span>
                                <span className='address'>b-19 janakpuri</span>
                            </div>
                        </div>
                        <div className='phone-title-svg'>
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-phone"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /></svg>
                            <div className='phone-div'>
                                <span className='phone-title'>Phone</span>
                                <span className='phone'>7838651655</span>
                            </div>
                        </div>
                        <div className='email-title-svg'>
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-mail"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" /><path d="M3 7l9 6l9 -6" /></svg>
                            <div className='email-contactus-div'>
                                <span className='email-contactus-title'>Email</span>
                                <span className='email-ofus'>bishtchirag13@gmail.com</span>
                            </div>
                        </div>
                    </div>

                    <div className='contactus-form'>
                        <div className='contactus-form-content'>
                        <h1 className='sendmessage-title'>Send Message</h1>
                        <input placeholder='Full Name'/>
                        <input placeholder='Email'/>
                        <input placeholder='Type your Message' className='type-your-message'/>
                        <button className='send-button'>Send</button>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    )
}

export default ContactUs