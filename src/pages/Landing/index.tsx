import React from 'react'
import LandingNavbar from '@/components/Landing/Navbar'
import Header from '@/components/Landing/Header'
import Stepper from '@/components/Landing/Stepper'
import Feature from '@/components/Landing/Feature'
import Integration from '@/components/Landing/Integration'
import Solution from '@/components/Landing/Solution'
import Blog from '@/components/Landing/Blog'
import Customer from '@/components/Landing/Customer'
import FAQ from '@/components/Landing/FAQ'
import ContactSection from '@/components/Landing/ContactUs'
import Landing from "@/components/Landing/Footer"
import Footer from '@/components/Landing/Footer'
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