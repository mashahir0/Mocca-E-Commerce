import React from 'react'
import Navbar from '../../components/user/Navbar'
import TrendingPro from '../../components/user/TrendingPro'
import NewArrivals from '../../components/user/NewArrivals'
import Footer from '../../components/user/Footer'

function HomePage() {
  return (
    <>
      <Navbar/>
      <TrendingPro/>
      <NewArrivals/>
      <Footer/>
    </>
  )
}

export default HomePage