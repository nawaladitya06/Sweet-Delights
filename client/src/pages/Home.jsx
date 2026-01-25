import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import HeroSection from '../components/HeroSection';
import ScrollytellingVisuals from '../components/ScrollytellingVisuals';
import CategoryGrid from '../components/CategoryGrid';
import BestSellers from '../components/BestSellers';

const Home = () => {
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark">
            <PageTitle title="Home" />
            <Header />
            <main className="flex-grow">
                <ScrollytellingVisuals />
                <HeroSection />
                <CategoryGrid />
                <BestSellers />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
