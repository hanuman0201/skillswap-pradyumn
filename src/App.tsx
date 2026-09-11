import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LearnPage } from './components/LearnPage';
import { TeachPage } from './components/TeachPage';
import { ProfilePage } from './components/ProfilePage';
import { StorySection } from './components/StorySection';
import { MasterFlow } from './components/MasterFlow';
import { InteractiveFeatures } from './components/InteractiveFeatures';
import { CommunityTrust } from './components/CommunityTrust';
import { Testimonials } from './components/Testimonials';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { InteractiveModal } from './components/InteractiveModal';
import { TeachModal } from './components/TeachModal';
import { LiveMarketplace } from './components/LiveMarketplace';
import { CreateListingModal } from './components/CreateListingModal';
import { UserProfile, DEFAULT_USER, createInitialUserProfile } from './types';
import {
  auth,
  signOutUser,
  fetchUserProfileFromFirestore,
  updateUserProfileInFirestore,
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'learn' | 'teach' | 'profile'>(() => {
    const hash = window.location.hash;
    if (hash === '#learn') return 'learn';
    if (hash === '#teach') return 'teach';
    if (hash === '#profile') return 'profile';
    return 'home';
  });

  // User authentication state (persisted to localStorage)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('skillspace_user');
      if (saved) {
        const parsed = JSON.parse(saved) as UserProfile;
        // If an old stale demo user is in storage, ignore it
        if (parsed.id === 'usr_001' && parsed.email === 'alex.rivers@skillspace.io') {
          return null;
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Get Started with SkillSpace');
  const [modalType, setModalType] = useState<'access' | 'story' | 'features' | 'login'>('access');
  const [selectedSkillForSwap, setSelectedSkillForSwap] = useState('');
  const [teachModalOpen, setTeachModalOpen] = useState(false);
  const [createListingModalOpen, setCreateListingModalOpen] = useState(false);

  // Sync with real Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const live = await fetchUserProfileFromFirestore(firebaseUser.uid);
        const userObj: UserProfile = createInitialUserProfile(
          firebaseUser.uid,
          firebaseUser.email || '',
          live?.displayName || firebaseUser.displayName || undefined,
          live?.photoURL || firebaseUser.photoURL || undefined
        );
        if (live?.bio) userObj.bio = live.bio;
        if (live?.coins !== undefined) {
          userObj.coins = live.coins;
          userObj.credits = live.coins;
        }

        // Preserve any custom skills or bio saved in session for this specific UID
        try {
          const saved = localStorage.getItem('skillspace_user');
          if (saved) {
            const parsed = JSON.parse(saved) as UserProfile;
            if (parsed && parsed.id === firebaseUser.uid) {
              if (parsed.skillsToTeach?.length) userObj.skillsToTeach = parsed.skillsToTeach;
              if (parsed.skillsToLearn?.length) userObj.skillsToLearn = parsed.skillsToLearn;
              if (parsed.bio) userObj.bio = parsed.bio;
              if (parsed.location) userObj.location = parsed.location;
            }
          }
        } catch {}

        setCurrentUser(userObj);
        try {
          localStorage.setItem('skillspace_user', JSON.stringify(userObj));
        } catch {}
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#learn') {
        setCurrentView('learn');
      } else if (hash === '#teach') {
        setCurrentView('teach');
      } else if (hash === '#profile') {
        setCurrentView('profile');
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToLearn = () => {
    setCurrentView('learn');
    window.location.hash = '#learn';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTeach = () => {
    setCurrentView('teach');
    window.location.hash = '#teach';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProfile = () => {
    // If not logged in, prompt user to log in instead of force-assigning Alex Rivers
    if (!currentUser) {
      handleOpenAuth('Sign in to view your profile');
      return;
    }
    setCurrentView('profile');
    window.location.hash = '#profile';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentView('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('skillspace_user', JSON.stringify(user));
    } catch {
      // ignore
    }
    setModalOpen(false);
    // Navigate straight to user profile
    setCurrentView('profile');
    window.location.hash = '#profile';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.error('Sign out error:', e);
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem('skillspace_user');
    } catch {
      // ignore
    }
    navigateToHome();
  };

  const handleOpenCreateListing = () => {
    if (!currentUser) {
      handleOpenAuth('Sign in to post a skill listing');
      return;
    }
    setCreateListingModalOpen(true);
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('skillspace_user', JSON.stringify(updatedUser));
      if (auth.currentUser && auth.currentUser.uid === updatedUser.id) {
        await updateUserProfileInFirestore(updatedUser.id, {
          displayName: updatedUser.name,
          bio: updatedUser.bio,
          coins: updatedUser.coins,
        });
      }
    } catch (e) {
      console.warn('Update user error:', e);
    }
  };

  const handleOpenAuth = (customTitle = 'Join SkillSpace', skillName?: string) => {
    setModalTitle(customTitle);
    setModalType('login');
    if (skillName) {
      setSelectedSkillForSwap(skillName);
    }
    setModalOpen(true);
  };

  const handleOpenStory = () => {
    setModalTitle('Why SkillSpace Exists');
    setModalType('story');
    setModalOpen(true);
  };

  const handleOpenLegalOrInfo = (title: string) => {
    setModalTitle(title);
    setModalType('story');
    setModalOpen(true);
  };

  const handleSelectSkillToLearn = (skillName: string) => {
    setSelectedSkillForSwap(skillName);
    handleOpenAuth(`Propose 1:1 Skill Swap: ${skillName}`, skillName);
  };

  const scrollToSection = (id: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      window.location.hash = '';
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  // 1. Dedicated Learn Space Page (Black & White Glass UI)
  if (currentView === 'learn') {
    return (
      <div className="min-h-screen bg-[#070709] text-white">
        <LearnPage
          onBackToHome={navigateToHome}
          onOpenTeach={navigateToTeach}
          onOpenProfile={navigateToProfile}
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
        />

        {/* Interactive Modal */}
        <InteractiveModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedSkillForSwap('');
          }}
          title={modalTitle}
          type={modalType}
          initialSkillToLearn={selectedSkillForSwap}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  // 2. Dedicated Teach Space Page (Black & White Glass UI)
  if (currentView === 'teach') {
    return (
      <div className="min-h-screen bg-[#070709] text-white">
        <TeachPage
          onBackToHome={navigateToHome}
          onOpenLearn={navigateToLearn}
          onOpenProfile={navigateToProfile}
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
        />

        {/* Interactive Modal */}
        <InteractiveModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedSkillForSwap('');
          }}
          title={modalTitle}
          type={modalType}
          initialSkillToLearn={selectedSkillForSwap}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  // 3. Dedicated Profile Page
  if (currentView === 'profile') {
    return (
      <div className="min-h-screen bg-[#070709] text-white">
        <ProfilePage
          key={currentUser?.id || 'guest'}
          user={currentUser || DEFAULT_USER}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
          onBackToHome={navigateToHome}
          onOpenLearn={navigateToLearn}
          onOpenTeach={navigateToTeach}
        />

        {/* Interactive Modal */}
        <InteractiveModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedSkillForSwap('');
          }}
          title={modalTitle}
          type={modalType}
          initialSkillToLearn={selectedSkillForSwap}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  // 4. Home Page View
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative">
      {/* Fixed Navigation with profile pill replacing Get Started when logged in */}
      <Navbar
        onOpenAuth={() => handleOpenAuth('Log In or Join SkillSpace')}
        onNavigateSection={scrollToSection}
        onOpenTeach={navigateToTeach}
        onSelectSkillToLearn={handleSelectSkillToLearn}
        onOpenLearnPage={navigateToLearn}
        currentUser={currentUser}
        onOpenProfile={navigateToProfile}
        onLogout={handleLogout}
        onOpenCreateListing={handleOpenCreateListing}
      />

      {/* Main Page Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero
          onOpenAuth={() => handleOpenAuth('Start Exchanging Skills')}
          onExploreFeatures={() => scrollToSection('features')}
          isLoggedIn={!!currentUser}
          onOpenProfile={navigateToProfile}
        />

        {/* 2. Why SkillSpace Exists */}
        <StorySection onOpenStory={handleOpenStory} />

        {/* 3. Master Flow (Feature Cards) */}
        <MasterFlow
          onOpenAuth={() => handleOpenAuth('Create Your SkillSpace Profile')}
          onHowItWorks={() => scrollToSection('features')}
        />

        {/* 4. Live Cloud Marketplace (Real-Time Cloud Firestore Multi-User Listings) */}
        <LiveMarketplace
          currentUser={currentUser}
          onOpenCreateListing={handleOpenCreateListing}
          onOpenAuth={() => handleOpenAuth('Sign In to Create Listings')}
          onOpenMessengerWithUser={(contactName, initialMsg) => {
            navigateToTeach();
          }}
        />

        {/* 5. Deep Dive Interactive Features */}
        <InteractiveFeatures
          onOpenAuth={() => handleOpenAuth('Join SkillSpace Network')}
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
        />

        {/* 6. Community Trust & Philosophy */}
        <CommunityTrust />

        {/* 7. Testimonials Ticker */}
        <Testimonials
          onOpenAuth={() => handleOpenAuth('Join the Community')}
        />

        {/* 8. Pre-Footer Call to Action */}
        <CTASection
          onOpenAuth={() => handleOpenAuth('Get Instant Access')}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigateSection={scrollToSection}
        onOpenLegal={handleOpenLegalOrInfo}
      />

      {/* Cloud Firestore: Create Listing Modal */}
      <CreateListingModal
        isOpen={createListingModalOpen}
        onClose={() => setCreateListingModalOpen(false)}
        currentUser={currentUser}
        onOpenAuth={() => handleOpenAuth('Sign in to publish a listing')}
      />

      {/* Standard Interactive Modal */}
      <InteractiveModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSkillForSwap('');
        }}
        title={modalTitle}
        type={modalType}
        initialSkillToLearn={selectedSkillForSwap}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Black & White Glass UI: Quick Teach Modal */}
      <TeachModal
        isOpen={teachModalOpen}
        onClose={() => setTeachModalOpen(false)}
      />
    </div>
  );
}
