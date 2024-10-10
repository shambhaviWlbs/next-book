"use client"; // Add this line to indicate that this is a client component

import { motion } from 'framer-motion';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Editor, useDomValue } from "reactjs-editor";
import styles from './book.module.css';

export default function BookPage() {
   const { id } = useParams();
   const [selectedBook, setSelectedBook] = useState(null);
   const { dom, setDom } = useDomValue();
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const notify = () => toast("Your changes have been saved!!");

   const handleSave = () => {
      if (!selectedBook) {
         console.error("No book selected");
         return; 
      }

      const updatedDomValue = {
         key: dom?.key,
         props: dom?.props,
         ref: dom?.ref,
         type: dom?.type,
      };

      localStorage.setItem(`dom${selectedBook.id}`, JSON.stringify(updatedDomValue));
      notify();
   };

   useEffect(() => {
      const fetchBook = async () => {
         try {
            const response = await fetch(`/api/books/${id}`);
            if (!response.ok) {
               throw new Error("Book not found");
            }
            const data = await response.json();
            setSelectedBook(data);
         } catch (error) {
            setError(error.message);
            console.error(error);
         } finally {
            setLoading(false);
         }
      };

      fetchBook();

      const savedDom = localStorage.getItem(`dom${id}`);
      if (savedDom) {
         setDom(JSON.parse(savedDom));
      }
   }, [id, setDom]);

   if (loading) return <p>Loading...</p>; // Show loading state
   if (error) return <p>{error}</p>; // Show error state
   if (!selectedBook) return <p>No book data available.</p>; // Fallback content

   return (
      <motion.div transition={{ type: 'spring', damping: 40, mass: 0.75 }}
         initial={{ opacity: 0, x: 1000 }} animate={{ opacity: 1, x: 0 }}>
         <motion.section transition={{ type: 'spring', damping: 44, mass: 0.75 }}
            initial={{ opacity: 0, y: -1000 }} animate={{ opacity: 1, y: 0 }} className={styles.appBar}>
            <div className={styles.leftIcons}>
               <i style={{ fontSize: '20px', cursor: 'pointer' }} className="fas fa-chevron-left"></i>
            </div>
            <div className={styles.title}>
               <h2 className={styles.titleStyles}>{selectedBook.title || "Untitled"}</h2>
            </div>
            <div className={styles.icons}>
               <button className={styles.saveButton} onClick={handleSave}>Save</button>
               <i style={iconStyle} className="fas fa-cog"></i>
               <i style={iconStyle} className="fas fa-share"></i>
               <i style={iconStyle} className="fas fa-search"></i>
            </div>
         </motion.section>

         <main className={styles.bookContainer}>
            <aside>
               <h1 className="center">{selectedBook.title || "Untitled"}</h1>
               <span className="center small">By {selectedBook.author || "Unknown Author"}</span>
               <div dangerouslySetInnerHTML={{ __html: selectedBook.content || "<p>No content available.</p>" }} />
            </aside>
         </main>

         <Editor htmlContent={dom ? dom : ""} />
         <ToastContainer />
      </motion.div>
   );
}

const iconStyle = { marginRight: '20px', fontSize: '20px' };
