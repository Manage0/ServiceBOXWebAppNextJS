import SignInForm from '@/app/signin/sign-in-form';
import { metaObject } from '@/config/site.config';
import AuthWrapperThree from '../shared/auth-layout/auth-wrapper-three';

export const metadata = {
  ...metaObject('Sign In'),
};

export default function SignIn() {
  return (
    <AuthWrapperThree
      title={
        <div className="font-lexendBold">
          Hello újra itt! Ne felejts el kijelentkezni ha végeztél!
        </div>
      }
    >
      <SignInForm />
    </AuthWrapperThree>
  );
}
