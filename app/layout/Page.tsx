import React, { useEffect, useState } from 'react'
import TopBar from './items/TopBar'
import Balance from './items/Balance';
import Stats from './items/Stats';
import Features from './items/Features';
import Reasons from './items/Reasons';
import Sales from './items/Sales';
import Footer from './items/Footer';

const Page = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );
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
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <TopBar isScrolled={isScrolled} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={() => setIsScrolled}></TopBar>
      <Balance></Balance>
      <Stats></Stats>
      <Features visibleSections={visibleSections}></Features>
      <Reasons visibleSections={visibleSections}></Reasons>
      <Sales></Sales>
      <Footer></Footer>
    </div>
  )
}
export default Page;