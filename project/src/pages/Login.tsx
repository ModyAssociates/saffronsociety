import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';          // yarn add react-icons
import { FaFacebook } from 'react-icons/fa';        // yarn add react-icons
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const {
    /* new helpers */
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithFacebook,
    /* legacy aliases (still available just in case) */
    signIn,
    signUp,
    loading: authLoading,
  } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
  });


  /* ------------------------------------------------------------------ */
  /*  SUBMIT (email / password)                                         */
  /* ------------------------------------------------------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // prefer new helper, fall back if only legacy exists
        if (signUpWithEmail)
          await signUpWithEmail(
            formData.email,
            formData.password,
            formData.fullName,
          );
        else
          await signUp(
            formData.email,
            formData.password,
            formData.fullName,
          );
        navigate('/account');
      } else {
        if (signInWithEmail)
          await signInWithEmail(formData.email, formData.password);
        else await signIn(formData.email, formData.password);
        navigate('/account');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                             */
  /* ------------------------------------------------------------------ */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* ---------------------------------------------------------------- */}
        {/*  HEADLINE / TOGGLE                                               */}
        {/* ---------------------------------------------------------------- */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              {isSignUp
                ? 'sign in to existing account'
                : 'create a new account'}
            </button>
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*  SOCIAL LOGIN                                                    */}
        {/* ---------------------------------------------------------------- */}
        <button
          type="button"
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FcGoogle className="w-5 h-5" />
          <span className="text-sm font-medium text-gray-700">
            Continue with Google
          </span>
        </button>

        <button
          type="button"
          onClick={signInWithFacebook}
          className="mt-3 w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FaFacebook className="w-5 h-5 text-[#1877f2]" />
          <span className="text-sm font-medium text-gray-700">
            Continue with Facebook
          </span>
        </button>

        <div className="flex items-center gap-2 my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="text-xs text-gray-500 uppercase">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*  EMAIL / PASSWORD FORM                                          */}
        {/* ---------------------------------------------------------------- */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            {/* full name / phone (sign-up only) */}
            {isSignUp && (
              <>
                <Field
                  id="fullName"
                  type="text"
                  placeholder="Full Name"
                  icon={User}
                  required
                  value={formData.fullName}
                  onChange={val =>
                    setFormData({ ...formData, fullName: val })
                  }
                />
                <Field
                  id="phone"
                  type="tel"
                  placeholder="Phone Number (optional)"
                  icon={Phone}
                  value={formData.phone}
                  onChange={val => setFormData({ ...formData, phone: val })}
                />
              </>
            )}

            {/* email */}
            <Field
              id="email"
              type="email"
              placeholder="Email address"
              icon={Mail}
              required
              value={formData.email}
              onChange={val => setFormData({ ...formData, email: val })}
            />

            {/* password */}
            <Field
              id="password"
              type="password"
              placeholder="Password"
              icon={Lock}
              required
              value={formData.password}
              onChange={val => setFormData({ ...formData, password: val })}
              roundedBottom
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
          >
            {loading ? 'Processing…' : isSignUp ? 'Sign up' : 'Sign in'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Small field component                                              */
/* ------------------------------------------------------------------ */
interface FieldProps {
  id: string;
  type: string;
  placeholder: string;
  icon: React.ComponentType<any>;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  roundedBottom?: boolean;
}
const Field = ({
  id,
  type,
  placeholder,
  icon: Icon,
  value,
  onChange,
  required,
  roundedBottom,
}: FieldProps) => (
  <div>
    <label htmlFor={id} className="sr-only">
      {placeholder}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete={type === 'password' ? (required ? 'new-password' : 'current-password') : undefined}
        className={`appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 ${
          roundedBottom ? 'rounded-b-md' : ''
        } focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default Login;
