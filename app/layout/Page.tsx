import React, { useEffect, useState } from 'react'
import TopBar from './items/TopBar'
import Balance from './items/Balance';
import Stats from './items/Stats';
import Features from './items/Features';
import Reasons from './items/Reasons';
import Sales from './items/Sales';
import Footer from './items/Footer';
import Login from '@/components/Auth/Login';
import Register from '@/components/Auth/Register';

const Page = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) =>
            new Set(prev).add(entry.target.id)
          );
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
    });

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);
  const toggleLogin = () =>{
    setShowLogin(true);
    setShowRegister(false);
  }
  const toggleRegister = () =>{
    setShowRegister(true);
    setShowLogin(false);
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <TopBar isScrolled={isScrolled} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={() => setMobileMenuOpen(!mobileMenuOpen)} openLogin={showLogin} 
      setOpenLogin={toggleLogin} openRegister={showRegister} setOpenRegister={toggleRegister}></TopBar>
      <Balance></Balance>
      <Stats></Stats>
      <Features visibleSections={visibleSections}></Features>
      <Reasons visibleSections={visibleSections}></Reasons>
      <Sales></Sales>
      <Footer></Footer>
      <Login isOpen={showLogin} onClose={()=>setShowLogin(false)} onSwitchToRegister={toggleRegister}></Login>
      <Register isOpen={showRegister} onClose={() =>setShowRegister(false)} onSwitchToLogin={toggleLogin}></Register>
    </div>
  )
}
export default Page;