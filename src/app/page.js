import DashboardLayout from "./components/DashboardLayout";
import styles from './page.module.css'


export default function Home() {
  return (
    <main className={styles.main}>
    <DashboardLayout/>
    </main>
  );
}
