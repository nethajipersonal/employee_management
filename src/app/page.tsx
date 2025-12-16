import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Redirect based on user role
    const role = session.user.role;
    if (role === 'admin') {
      redirect('/admin');
    } else if (role === 'manager') {
      redirect('/manager');
    } else {
      redirect('/employee');
    }
  }

  // Redirect to login if not authenticated
  redirect('/login');
}
