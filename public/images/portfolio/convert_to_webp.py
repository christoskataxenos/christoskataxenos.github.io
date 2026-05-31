import os
import sys
import threading
import tkinter as tk
from tkinter import scrolledtext, messagebox
from pathlib import Path
from PIL import Image

# Διόρθωση encoding για υποστήριξη Ελληνικών σε περιπτώσεις console logs
sys.stdout.reconfigure(encoding='utf-8')

def process_images_to_webp(directory_path: str, image_quality: int, log_widget: scrolledtext.ScrolledText) -> None:
    """
    Συνάρτηση που εκτελείται στο παρασκήνιο (background thread) 
    για την μετατροπή των εικόνων, χωρίς να 'παγώνει' το UI.
    """
    # Ορισμός της βασικής διαδρομής (base directory) χρησιμοποιώντας το Path
    base_dir = Path(directory_path)
    
    # Μετρητής για τα αρχεία που μετατράπηκαν επιτυχώς
    successful_conversions = 0
    
    # Βοηθητική συνάρτηση για εισαγωγή μηνυμάτων στο GUI
    def log_message(message: str):
        # Ενεργοποίηση, εισαγωγή, κύλιση στο τέλος, και απενεργοποίηση
        log_widget.config(state=tk.NORMAL)
        log_widget.insert(tk.END, message + "\n")
        log_widget.see(tk.END)
        log_widget.config(state=tk.DISABLED)

    log_message(f"Έναρξη αναζήτησης στον κατάλογο:\n{base_dir}\n")

    # Διατρέχουμε αναδρομικά (recursively) όλους τους φακέλους και τα αρχεία
    for current_file in base_dir.rglob("*"):
        # Ελέγχουμε αν είναι αρχείο και αν η κατάληξη είναι .jpg ή .jpeg
        if current_file.is_file() and current_file.suffix.lower() in [".jpg", ".jpeg"]:
            # Ορίζουμε το νέο όνομα αρχείου με κατάληξη .webp
            target_webp_file = current_file.with_suffix(".webp")
            
            # Ελέγχουμε αν το .webp αρχείο υπάρχει ήδη για να μην το ξαναγράψουμε
            if not target_webp_file.exists():
                try:
                    # Ανοίγουμε την εικόνα με την βιβλιοθήκη PIL
                    with Image.open(current_file) as image_object:
                        # Αποθηκεύουμε την εικόνα σε μορφή webp
                        image_object.save(target_webp_file, "webp", quality=image_quality)
                        
                        # Ενημερώνουμε το γραφικό περιβάλλον
                        log_message(f"[✓] Μετατροπή: {current_file.name} -> {target_webp_file.name}")
                        successful_conversions = successful_conversions + 1
                except Exception as error_message:
                    # Καταγράφουμε το σφάλμα
                    log_message(f"[✗] Σφάλμα στο {current_file.name}: {error_message}")
            else:
                log_message(f"[-] Παράλειψη: Το {target_webp_file.name} υπάρχει ήδη.")
                
    log_message(f"\nΔιαδικασία ολοκληρώθηκε! Συνολικά μετατράπηκαν: {successful_conversions} εικόνες.")
    
    # Εμφάνιση ενός παραθύρου (popup) στο τέλος
    messagebox.showinfo("Ολοκληρώθηκε", f"Η διαδικασία τελείωσε επιτυχώς!\nΜετατράπηκαν {successful_conversions} εικόνες.")


def start_conversion(directory_path: str, log_widget: scrolledtext.ScrolledText):
    """
    Ξεκινάει την μετατροπή δημιουργώντας ένα νέο thread,
    ώστε να παραμείνει το παράθυρο αποκρίσιμο κατά την εκτέλεση.
    """
    conversion_thread = threading.Thread(
        target=process_images_to_webp,
        args=(directory_path, 80, log_widget),
        daemon=True
    )
    conversion_thread.start()


def create_gui_app():
    """
    Στήσιμο και εκκίνηση του γραφικού περιβάλλοντος (GUI).
    """
    # Δημιουργία του κεντρικού παραθύρου
    root = tk.Tk()
    root.title("Portfolio WebP Converter")
    root.geometry("650x450")
    root.configure(padx=20, pady=20)
    
    # Προσπάθεια αλλαγής του εικονιδίου, αν χρειαστεί στο μέλλον, γίνεται εδώ

    # Τρέχων κατάλογος (για να ξέρει πού να ψάξει)
    script_directory = os.path.dirname(os.path.abspath(__file__))

    # Ετικέτα με οδηγίες
    instructions_text = "Μετατροπή όλων των αρχείων .jpg / .jpeg σε .webp.\nΘα σαρωθεί ο τρέχων φάκελος και όλοι οι υποφάκελοι του portfolio."
    description_label = tk.Label(
        root, 
        text=instructions_text,
        font=("Helvetica", 11),
        justify=tk.CENTER
    )
    description_label.pack(pady=(0, 15))

    # Κουμπί Εκκίνησης
    start_button = tk.Button(
        root, 
        text="Ξεκίνα την Μετατροπή", 
        font=("Helvetica", 12, "bold"),
        bg="#007ACC",
        fg="white",
        activebackground="#005A9E",
        activeforeground="white",
        padx=15,
        pady=8,
        cursor="hand2",
        command=lambda: start_conversion(script_directory, log_text)
    )
    start_button.pack(pady=10)

    # Ετικέτα πάνω από το Log
    log_label = tk.Label(root, text="Ιστορικό:", font=("Helvetica", 10, "italic"))
    log_label.pack(anchor="w", pady=(10, 0))

    # Περιοχή καταγραφής μηνυμάτων (ScrolledText)
    log_text = scrolledtext.ScrolledText(
        root, 
        width=80, 
        height=15, 
        state=tk.DISABLED, 
        bg="#1E1E1E", 
        fg="#D4D4D4",
        font=("Consolas", 9)
    )
    log_text.pack(fill=tk.BOTH, expand=True)

    # Έναρξη του κύριου βρόχου του γραφικού περιβάλλοντος
    root.mainloop()


if __name__ == "__main__":
    create_gui_app()
