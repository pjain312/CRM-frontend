import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import config from '../../config/environment';
import { saveTokens, saveUser } from '../../utils/auth';
import Logo from '../../assets/Logo.png';
// Removed image import - using gradient background instead

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${config.api.baseURL}/auth/login`, data);
      const tokens = response.data.data;
      saveTokens(tokens.accessToken, tokens.refreshToken);
      saveUser(tokens.user);
      navigate('/dashboard');
      toast.success(`Welcome ${tokens.user.Name}`)
    } catch (error) {
      console.log('Login error:', error);
      toast.error("Something went wrong please try again later!")
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gray-50 opacity-50" 
           style={{
             backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }}>
      </div>
      
      <Card className="w-full max-w-4xl mx-auto relative z-10 py-0">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-[600px]">
            {/* Login Form Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                  <img 
                    src={Logo} 
                    alt="Kinetara Logo" 
                    className="h-16 w-auto"
                  />
                </div>

                {/* Welcome text */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome back
                  </h1>
                  <p className="text-gray-600">
                    Login to your CRM account
                  </p>
                </div>

                {/* Login Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Username Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      rules={{ required: 'Username is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your username"
                              {...field}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      rules={{ required: 'Password is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <button
                              type="button"
                              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              Forgot your password?
                            </button>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                {...field}
                                className="h-11 pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showPassword ? (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Login Button */}
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                      Login
                    </Button>
                  </form>
                </Form>
              </div>
            </div>

            {/* Modern Animated Background Section */}
            <div className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 h-full">
              {/* Animated geometric shapes */}
              <div className="absolute inset-0">
                {/* Large floating circles */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 bg-opacity-30 rounded-full animate-float-gentle"></div>
                <div className="absolute top-40 right-32 w-24 h-24 bg-indigo-200 bg-opacity-40 rounded-full animate-float-gentle-delayed"></div>
                <div className="absolute bottom-32 left-32 w-28 h-28 bg-purple-200 bg-opacity-35 rounded-full animate-float-gentle-slow"></div>
                <div className="absolute bottom-20 right-20 w-20 h-20 bg-cyan-200 bg-opacity-30 rounded-full animate-float-gentle"></div>
                
                {/* Medium shapes */}
                <div className="absolute top-1/3 left-1/2 w-16 h-16 bg-blue-300 bg-opacity-25 rounded-full animate-pulse-gentle"></div>
                <div className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-indigo-300 bg-opacity-30 rounded-full animate-pulse-gentle-delayed"></div>
                
                {/* Small accent dots */}
                <div className="absolute top-16 right-16 w-3 h-3 bg-blue-400 rounded-full animate-twinkle"></div>
                <div className="absolute top-32 left-16 w-2 h-2 bg-indigo-400 rounded-full animate-twinkle-delayed"></div>
                <div className="absolute bottom-24 right-12 w-2 h-2 bg-purple-400 rounded-full animate-twinkle"></div>
                <div className="absolute bottom-16 left-24 w-3 h-3 bg-cyan-400 rounded-full animate-twinkle-delayed"></div>
              </div>
              
              {/* Animated lines/connections */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-px h-20 bg-gradient-to-b from-blue-300 to-transparent animate-line-grow"></div>
                <div className="absolute top-1/3 right-1/4 w-16 h-px bg-gradient-to-r from-indigo-300 to-transparent animate-line-grow-delayed"></div>
                <div className="absolute bottom-1/4 left-1/3 w-px h-16 bg-gradient-to-t from-purple-300 to-transparent animate-line-grow-slow"></div>
              </div>
              
              {/* Subtle wave pattern */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-100 to-transparent animate-wave"></div>
              
              {/* Floating particles */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-blue-500 rounded-full animate-particle-float-1"></div>
                <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-indigo-500 rounded-full animate-particle-float-2"></div>
                <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-purple-500 rounded-full animate-particle-float-3"></div>
                <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-cyan-500 rounded-full animate-particle-float-4"></div>
              </div>
              
              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-100/30"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
