import React from 'react'
import LandingNavbar from './Navbar'
import Header from './Header'
import Stepper from './Stepper'
import Feature from './Feature'
import Integration from './Integration'
import Solution from './Solution'
import Blog from './Blog'
import Customer from './Customer'
import FAQ from './FAQ'
import ContactSection from './ContactUs'
import Footer from "./Footer";
function index() {
  return (
    <div >
       <LandingNavbar/>
       <Header/>
       <Stepper/>
       <Feature/>
       <Integration/>
       <Solution/>
       <Blog/>
       <Customer/>
        <FAQ/>
        <ContactSection/>
        <Footer/>
    </div>
  )
}

export default index