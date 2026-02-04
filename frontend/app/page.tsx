import React from 'react'
import Navbar from '../components/navbar'
import HeroSection from '../components/hero'
import HowItWorksSection from '../components/howitworks'
import WhyThisMattersSection from '../components/whythismatter'
import FinalCTASection from '../components/finalcta'
const page = () => {
  return (
    <>
    <Navbar/>
    <HeroSection/>
    <HowItWorksSection/>
    <WhyThisMattersSection/>
    <FinalCTASection/>
    </>
  )
}

export default page
