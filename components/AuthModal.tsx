
import React, { useState } from 'react';
// Fix: Add .tsx extension to module path
import { GoogleIcon, MobileIcon } from './Icons.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // States for different auth flows
  const [authMethod, setAuthMethod] = useState<'default' | 'mobile'>('default');
  const [mobileStep, setMobileStep] = useState<'number' | 'otp'>('number');
  
  // Form inputs
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const resetState = () => {
      setAuthMethod('default');
      setMobileStep('number');
      setPhoneNumber('');
      setOtpCode('');
      setIsLoading(false);
      setSuccessMessage('');
  };

  const handleClose = () => {
      resetState();
      onClose();
  }

  const handleGoogleLogin = () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
          setIsLoading(false);
          setSuccessMessage(`Successfully signed in with Google as ${activeTab === 'signin' ? 'user' : 'new user'}.`);
          setTimeout(handleClose, 2000);
      }, 1500);
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(!phoneNumber) return;
      setIsLoading(true);
      // Simulate sending OTP
      setTimeout(() => {
          setIsLoading(false);
          setMobileStep('otp');
      }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
      e.preventDefault();
      if(!otpCode) return;
      setIsLoading(true);
      // Simulate verifying OTP
      setTimeout(() => {
          setIsLoading(false);
          setSuccessMessage('Phone number verified successfully!');
          setTimeout(handleClose, 2000);
      }, 1500);
  };

  const TabButton: React.FC<{ tab: 'signin' | 'signup', children: React.ReactNode }> = ({ tab, children }) => (
    <button
      onClick={() => {
          setActiveTab(tab);
          resetState();
      }}
      className={`w-1/2 py-3 font-bold text-center transition-colors ${
        activeTab === tab ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in-up" onClick={handleClose}>
      <div
        className="bg-gray-900 border border-purple-500 rounded-2xl w-full max-w-md shadow-2xl p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {activeTab === 'signin' ? 'Welcome Back!' : 'Join PyCom'}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
        </div>
        
        <div className="border-b border-gray-700 mt-4 mb-6">
            <div className="flex">
                <TabButton tab="signin">Sign In</TabButton>
                <TabButton tab="signup">Sign Up</TabButton>
            </div>
        </div>

        {successMessage ? (
            <div className="text-center py-8 animate-pop-in">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
                <p className="text-gray-300">{successMessage}</p>
            </div>
        ) : (
            <>
                {/* Default View: Social Login + Email Form */}
                {authMethod === 'default' && (
                    <div className="space-y-4 animate-fade-in-up">
                        <button 
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <span className="animate-spin h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full"></span>
                            ) : (
                                <GoogleIcon className="w-5 h-5" />
                            )}
                            <span>Continue with Google</span>
                        </button>

                        <button 
                            onClick={() => setAuthMethod('mobile')}
                            className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-3 border border-gray-600"
                        >
                            <MobileIcon className="w-5 h-5 text-purple-400" />
                            <span>Continue with Mobile</span>
                        </button>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-700"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">Or continue with email</span>
                            <div className="flex-grow border-t border-gray-700"></div>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-gray-300 mb-1 text-sm">Email</label>
                                <input type="email" className="w-full bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1 text-sm">Password</label>
                                <input type="password" className="w-full bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" placeholder="••••••••" />
                            </div>
                            <button className="w-full mt-2 bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors">
                                {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Mobile Authentication Flow */}
                {authMethod === 'mobile' && (
                    <div className="animate-fade-in-up">
                        <button onClick={() => setAuthMethod('default')} className="text-purple-400 text-sm font-semibold hover:text-purple-300 mb-4 flex items-center gap-1">
                            &larr; Back to all methods
                        </button>

                        {mobileStep === 'number' ? (
                            <form onSubmit={handleMobileSubmit} className="space-y-4">
                                <h3 className="text-lg font-bold text-white">Enter your mobile number</h3>
                                <p className="text-sm text-gray-400">We'll send you a verification code.</p>
                                <div className="flex gap-2">
                                    <select className="bg-gray-700 rounded-lg p-3 text-white border-r border-gray-600 focus:outline-none">
                                        <option>+1</option>
                                        <option>+91</option>
                                        <option>+44</option>
                                    </select>
                                    <input 
                                        type="tel" 
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="flex-grow bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                                        placeholder="Mobile Number" 
                                        required
                                    />
                                </div>
                                <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors flex justify-center">
                                    {isLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Get OTP'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOTP} className="space-y-4">
                                <h3 className="text-lg font-bold text-white">Enter Verification Code</h3>
                                <p className="text-sm text-gray-400">Enter the 6-digit code sent to your mobile.</p>
                                <input 
                                    type="text" 
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    className="w-full bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-center tracking-widest text-xl" 
                                    placeholder="000000" 
                                    required
                                />
                                <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors flex justify-center">
                                    {isLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Verify & Continue'}
                                </button>
                                <button type="button" onClick={() => setMobileStep('number')} className="w-full text-sm text-gray-400 hover:text-white">
                                    Change Number
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </>
        )}

        <p className="text-center text-gray-600 text-xs mt-6">
            By continuing, you agree to PyCom's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;