import { useEffect, useState } from 'react';
import { firestore, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { query, collection, where, getDocs } from 'firebase/firestore';

export const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const getUser = query(collection(firestore, 'users'), where('email', '==', user.email));
          const querySnapshot = await getDocs(getUser);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const userRole = userData.position || null; 
            const userName = userData.name || null; 
            setRole(userRole);
            setName(userName);
          } else {
            setRole(null); // Si no se encuentra el usuario
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // No hay dependencias específicas, ya que todo ocurre en la suscripción a onAuthStateChanged

  return { role, loading, name };
};
