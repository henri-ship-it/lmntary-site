import type { Metadata } from 'next';
import SignInForm from './SignInForm';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Sign in | LMNTARY Performance',
  description:
    'Sign in to access your Limitless lessons. No passwords — we send a one-time link to your email.',
};

export default function SignInPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Members</p>
        <h1 className={styles.heading}>Sign in with email</h1>
        <p className={styles.desc}>
          Enter the email address you used at checkout and we&apos;ll send you a one-time link to access your lessons. No passwords. No signup forms.
        </p>
        <SignInForm />
        <div className={styles.divider}></div>
        <p className={styles.note}>
          Not enrolled yet?{' '}
          <a href="/programmes" className={styles.noteLink}>
            View programmes &rarr;
          </a>
        </p>
      </div>
    </div>
  );
}
