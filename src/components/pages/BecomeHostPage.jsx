import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { 
  Home, 
  DollarSign, 
  Users, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Star,
  Calendar,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

const BecomeHostPage = () => {
  const navigate = useNavigate();
  const { user, becomeHost, isHost } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hostData, setHostData] = useState({
    motivation: '',
    experience: '',
    propertyTypes: [],
    expectations: {
      monthlyIncome: '',
      guestsPerMonth: '',
      timeCommitment: ''
    },
    agreements: {
      termsOfService: false,
      hostStandards: false,
      cancellationPolicy: false,
      dataPrivacy: false
    }
  });

  // Redirect if already a host
  React.useEffect(() => {
    if (isHost()) {
      navigate('/host/dashboard');
    }
  }, [isHost, navigate]);

  const propertyTypeOptions = [
    { id: 'apartment', label: 'Apartment', icon: '🏠' },
    { id: 'house', label: 'House', icon: '🏡' },
    { id: 'villa', label: 'Villa', icon: '🏘️' },
    { id: 'condo', label: 'Condo', icon: '🏢' },
    { id: 'cabin', label: 'Cabin', icon: '🏕️' },
    { id: 'studio', label: 'Studio', icon: '🏠' },
    { id: 'loft', label: 'Loft', icon: '🏭' },
    { id: 'other', label: 'Other', icon: '🏘️' }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setHostData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setHostData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handlePropertyTypeToggle = (propertyType) => {
    setHostData(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(propertyType)
        ? prev.propertyTypes.filter(type => type !== propertyType)
        : [...prev.propertyTypes, propertyType]
    }));
  };

  const handleAgreementToggle = (agreement) => {
    setHostData(prev => ({
      ...prev,
      agreements: {
        ...prev.agreements,
        [agreement]: !prev.agreements[agreement]
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate agreements
      const allAgreementsChecked = Object.values(hostData.agreements).every(Boolean);
      if (!allAgreementsChecked) {
        toast.error('Please accept all terms and agreements to become a host');
        return;
      }

      // Call becomeHost API
      const result = await becomeHost(hostData);
      
      if (result.success) {
        toast.success('Congratulations! You are now a StayFinder host!');
        navigate('/host/dashboard');
      } else {
        toast.error(result.error || 'Failed to become a host');
      }
    } catch (error) {
      console.error('Error becoming host:', error);
      toast.error('An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to StayFinder Hosting</CardTitle>
        <p className="text-gray-600 mt-2">
          Join thousands of hosts earning extra income by sharing their space
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Earn Extra Income</h3>
            <p className="text-sm text-gray-600">
              Hosts earn an average of $924 per month sharing their space
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Meet New People</h3>
            <p className="text-sm text-gray-600">
              Connect with travelers from around the world
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Host Protection</h3>
            <p className="text-sm text-gray-600">
              $1M+ insurance coverage and 24/7 support
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold mb-3">What you'll get as a host:</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Professional listing tools</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Calendar management system</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Secure payment processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Guest communication tools</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Performance analytics</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button onClick={nextStep} className="px-8">
            Get Started <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Tell us about yourself</CardTitle>
        <p className="text-gray-600">
          Help us understand your hosting goals and experience
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="motivation">What motivates you to become a host?</Label>
          <Textarea
            id="motivation"
            value={hostData.motivation}
            onChange={(e) => handleInputChange('motivation', e.target.value)}
            placeholder="Share your reasons for wanting to host guests..."
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="experience">Do you have any hosting or hospitality experience?</Label>
          <Textarea
            id="experience"
            value={hostData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            placeholder="Tell us about any relevant experience you have..."
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <Label>What type of properties are you interested in hosting?</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {propertyTypeOptions.map((option) => (
              <div
                key={option.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  hostData.propertyTypes.includes(option.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePropertyTypeToggle(option.id)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Set your expectations</CardTitle>
        <p className="text-gray-600">
          Help us understand your hosting goals
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="monthlyIncome">What monthly income are you hoping to earn?</Label>
          <Input
            id="monthlyIncome"
            value={hostData.expectations.monthlyIncome}
            onChange={(e) => handleInputChange('expectations.monthlyIncome', e.target.value)}
            placeholder="e.g., $500 - $1000"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="guestsPerMonth">How many guests would you like to host per month?</Label>
          <Input
            id="guestsPerMonth"
            value={hostData.expectations.guestsPerMonth}
            onChange={(e) => handleInputChange('expectations.guestsPerMonth', e.target.value)}
            placeholder="e.g., 5-10 guests"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="timeCommitment">How much time can you dedicate to hosting?</Label>
          <Input
            id="timeCommitment"
            value={hostData.expectations.timeCommitment}
            onChange={(e) => handleInputChange('expectations.timeCommitment', e.target.value)}
            placeholder="e.g., 2-3 hours per week"
            className="mt-1"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Hosting Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Great photos can increase bookings by up to 40%</li>
            <li>• Quick response times lead to higher guest satisfaction</li>
            <li>• Competitive pricing helps attract more bookings</li>
            <li>• Personal touches make guests feel welcome</li>
          </ul>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Terms and Agreements</CardTitle>
        <p className="text-gray-600">
          Please review and accept our hosting terms
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="termsOfService"
              checked={hostData.agreements.termsOfService}
              onCheckedChange={() => handleAgreementToggle('termsOfService')}
            />
            <div>
              <Label htmlFor="termsOfService" className="font-medium">
                Terms of Service
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                I agree to StayFinder's Terms of Service and Community Standards
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="hostStandards"
              checked={hostData.agreements.hostStandards}
              onCheckedChange={() => handleAgreementToggle('hostStandards')}
            />
            <div>
              <Label htmlFor="hostStandards" className="font-medium">
                Host Standards
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                I commit to maintaining high standards of cleanliness, safety, and hospitality
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="cancellationPolicy"
              checked={hostData.agreements.cancellationPolicy}
              onCheckedChange={() => handleAgreementToggle('cancellationPolicy')}
            />
            <div>
              <Label htmlFor="cancellationPolicy" className="font-medium">
                Cancellation Policy
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                I understand and agree to StayFinder's cancellation policies
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="dataPrivacy"
              checked={hostData.agreements.dataPrivacy}
              onCheckedChange={() => handleAgreementToggle('dataPrivacy')}
            />
            <div>
              <Label htmlFor="dataPrivacy" className="font-medium">
                Data Privacy
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                I agree to StayFinder's Privacy Policy and data handling practices
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">🎉 You're almost ready!</h4>
          <p className="text-sm text-green-800">
            Once you become a host, you'll be able to create your first listing and start earning income.
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !Object.values(hostData.agreements).every(Boolean)}
            className="px-8"
          >
            {loading ? 'Processing...' : 'Become a Host'} 
            {!loading && <CheckCircle className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Become a StayFinder Host
          </h1>
          <p className="text-xl text-gray-600">
            Start your hosting journey in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step <= currentStep
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Welcome</span>
            <span>About You</span>
            <span>Expectations</span>
            <span>Agreements</span>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default BecomeHostPage;

