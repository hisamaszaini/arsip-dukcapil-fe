import customtkinter as ctk
from tkinter import filedialog, messagebox
from tkcalendar import DateEntry
import os
import threading
import time
from PIL import Image
import requests
import re
from datetime import datetime

# Set appearance mode and color theme
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# --- Konfigurasi Kategori dan Skema ---
CATEGORY_CONFIG = {
    "Akta Kelahiran": {
        "endpoint_slug": "akta-kelahiran",
        "fields": [
            {
                "name": "noAkta",
                "label": "No. Akta",
                "type": "akta_format",
                "placeholder": "3502-LL-XXXXXXXX-XXXX"
            },
            {
                "name": "noFisik",
                "label": "Nomor Fisik",
                "type": "text",
                "placeholder": "Masukkan nomor fisik"
            },
        ]
    },
    "Akta Kematian": {
        "endpoint_slug": "akta-kematian",
        "fields": [
            {
                "name": "noAkta",
                "label": "Nomor Akta Kematian",
                "type": "text",
                "placeholder": "Masukkan nomor akta"
            },
            {
                "name": "noFisik",
                "label": "Nomor Fisik",
                "type": "text",
                "placeholder": "Masukkan nomor fisik"
            },
        ]
    },
    "Surat Kehilangan": {
        "endpoint_slug": "surat-kehilangan",
        "fields": [
            {
                "name": "nik",
                "label": "NIK",
                "type": "text",
                "placeholder": "16 digit angka"
            },
            {
                "name": "tanggal",
                "label": "Tanggal",
                "type": "date",
                "placeholder": "Pilih tanggal"
            },
            {
                "name": "noFisik",
                "label": "Nomor Fisik",
                "type": "text",
                "placeholder": "Masukkan nomor fisik"
            },
        ]
    },
    "Surat Permohonan Pindah": {
        "endpoint_slug": "surat-permohonan-pindah",
        "fields": [
            {
                "name": "nik",
                "label": "NIK",
                "type": "text",
                "placeholder": "16 digit angka"
            },
            {
                "name": "noFisik",
                "label": "Nomor Fisik",
                "type": "text",
                "placeholder": "Masukkan nomor fisik"
            },
        ]
    },
    "Surat Perubahan Kependudukan": {
        "endpoint_slug": "surat-perubahan-kependudukan",
        "fields": [
            {
                "name": "nik",
                "label": "NIK",
                "type": "text",
                "placeholder": "16 digit angka"
            },
            {
                "name": "noFisik",
                "label": "Nomor Fisik",
                "type": "text",
                "placeholder": "Masukkan nomor fisik"
            },
        ]
    },
}


class AktaFormattedEntry(ctk.CTkEntry):
    """Entry dengan auto-formatting untuk nomor akta kelahiran"""
    def __init__(self, master, **kwargs):
        super().__init__(master, **kwargs)
        self.bind("<KeyRelease>", self._format_akta)
        self._last_value = ""
    
    def _format_akta(self, event=None):
        # Ambil posisi cursor
        cursor_pos = self.index(ctk.INSERT)
        
        # Ambil value dan hapus karakter non-alphanumeric
        value = self.get().upper()
        
        # Hapus semua dash untuk processing
        clean = value.replace("-", "")
        
        # Jika user menghapus karakter, izinkan
        if len(clean) < len(self._last_value.replace("-", "")):
            self._last_value = value
            return
        
        # Format: 3502-LL-XXXXXXXX-XXXX
        formatted = ""
        
        if len(clean) > 0:
            # Part 1: 3502
            formatted = clean[:4]
            
            if len(clean) > 4:
                # Part 2: LL (2 huruf)
                formatted += "-" + clean[4:6]
                
                if len(clean) > 6:
                    # Part 3: XXXXXXXX (8 angka)
                    formatted += "-" + clean[6:14]
                    
                    if len(clean) > 14:
                        # Part 4: XXXX (4 angka)
                        formatted += "-" + clean[14:18]
        
        # Update entry jika berbeda
        if formatted != value:
            self.delete(0, ctk.END)
            self.insert(0, formatted)
            
            # Restore cursor position (approximate)
            try:
                new_pos = min(cursor_pos + (len(formatted) - len(value)), len(formatted))
                self.icursor(new_pos)
            except:
                pass
        
        self._last_value = formatted


class ModernScannerApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Window Configuration
        self.title("📄 Scanner Uploader Modern")
        self.geometry("1400x800")
        
        # Variables
        self.folder_path = ctk.StringVar(value=os.path.join(os.path.expanduser("~"), "scanned_docs"))
        self.ip_address = ctk.StringVar(value="http://192.10.35.35/api")
        self.username = ctk.StringVar()
        self.password = ctk.StringVar()
        self.access_token = None
        self.refresh_token = None
        self.user_profile = {}
        self.selected_category = ctk.StringVar()
        self.file_list = []
        self.current_preview = None
        self.form_entries = {}
        self.category_names = list(CATEGORY_CONFIG.keys())
        
        if not os.path.exists(self.folder_path.get()):
            os.makedirs(self.folder_path.get())
        
        self._create_ui()
        self._start_folder_monitoring()
        
        if self.category_names:
            self.selected_category.set(self.category_names[0])
            self._generate_form()

    def _create_ui(self):
        # Main container
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)
        
        # Header Frame
        self._create_header()
        
        # Content Frame
        content_frame = ctk.CTkFrame(self, fg_color="transparent")
        content_frame.grid(row=1, column=0, sticky="nsew", padx=20, pady=(0, 20))
        content_frame.grid_columnconfigure((0, 1, 2), weight=1)
        content_frame.grid_rowconfigure(0, weight=1)
        
        # Panels
        self._create_input_panel(content_frame)
        self._create_file_list_panel(content_frame)
        self._create_preview_panel(content_frame)

    def _create_header(self):
        header = ctk.CTkFrame(self, height=180, corner_radius=15)
        header.grid(row=0, column=0, sticky="ew", padx=20, pady=20)
        header.grid_columnconfigure(1, weight=1)
        
        # Title & Theme Toggle
        title_frame = ctk.CTkFrame(header, fg_color="transparent")
        title_frame.grid(row=0, column=0, columnspan=6, sticky="ew", pady=(15, 10), padx=20)
        title_frame.grid_columnconfigure(0, weight=1)
        
        ctk.CTkLabel(title_frame, text="📄 Scanner Uploader", 
                    font=ctk.CTkFont(size=28, weight="bold")).pack(side="left")
        
        theme_switch = ctk.CTkSwitch(title_frame, text="🌓 Dark Mode", 
                                     command=self._toggle_theme)
        theme_switch.pack(side="right")
        theme_switch.select()
        
        # Folder Path
        ctk.CTkLabel(header, text="📁 Folder Scan:", 
                    font=ctk.CTkFont(size=12)).grid(row=1, column=0, padx=(20, 5), pady=5, sticky="w")
        
        folder_entry = ctk.CTkEntry(header, textvariable=self.folder_path, 
                                   width=400, state="readonly")
        folder_entry.grid(row=1, column=1, padx=5, pady=5, sticky="ew")
        
        ctk.CTkButton(header, text="Pilih Folder", width=120,
                     command=self._select_folder).grid(row=1, column=2, padx=5, pady=5)
        
        # Server URL
        ctk.CTkLabel(header, text="🌐 Server URL:", 
                    font=ctk.CTkFont(size=12)).grid(row=2, column=0, padx=(20, 5), pady=5, sticky="w")
        
        ctk.CTkEntry(header, textvariable=self.ip_address, 
                    width=400).grid(row=2, column=1, padx=5, pady=5, sticky="ew")
        
        # Authentication Row
        ctk.CTkLabel(header, text="👤 Username:", 
                    font=ctk.CTkFont(size=12)).grid(row=3, column=0, padx=(20, 5), pady=8, sticky="w")
        
        login_frame = ctk.CTkFrame(header, fg_color="transparent")
        login_frame.grid(row=3, column=1, columnspan=5, sticky="w", pady=8)
        
        ctk.CTkEntry(login_frame, textvariable=self.username, 
                    width=180).pack(side="left", padx=(0, 20))
        
        ctk.CTkLabel(login_frame, text="🔒 Password:", 
                    font=ctk.CTkFont(size=12)).pack(side="left", padx=(0, 5))
        
        ctk.CTkEntry(login_frame, textvariable=self.password, 
                    show="●", width=180).pack(side="left", padx=(0, 20))
        
        self.auth_button = ctk.CTkButton(login_frame, text="Login", width=100,
                                        command=self._authenticate,
                                        fg_color="#2E7D32", hover_color="#1B5E20")
        self.auth_button.pack(side="left", padx=(0, 20))
        
        self.auth_status_label = ctk.CTkLabel(login_frame, text="⚠️ Belum Login",
                                             font=ctk.CTkFont(size=12),
                                             text_color="#F44336")
        self.auth_status_label.pack(side="left")

    def _create_input_panel(self, parent):
        panel = ctk.CTkFrame(parent, corner_radius=15)
        panel.grid(row=0, column=0, sticky="nsew", padx=(0, 10))
        panel.grid_rowconfigure(2, weight=1)
        
        # Title
        ctk.CTkLabel(panel, text="📝 Input Data", 
                    font=ctk.CTkFont(size=18, weight="bold")).pack(pady=15, padx=20, anchor="w")
        
        # Category Selection
        ctk.CTkLabel(panel, text="Pilih Kategori:", 
                    font=ctk.CTkFont(size=13)).pack(pady=(5, 5), padx=20, anchor="w")
        
        # Dropdown wrapper untuk handle click
        dropdown_frame = ctk.CTkFrame(panel, fg_color="transparent")
        dropdown_frame.pack(pady=(0, 15), padx=20, fill="x")
        
        self.category_dropdown = ctk.CTkComboBox(dropdown_frame, 
                                                 variable=self.selected_category,
                                                 values=self.category_names,
                                                 command=self._on_category_select,
                                                 width=280,
                                                 state="readonly")
        self.category_dropdown.pack(fill="x")
        
        # Bind click event untuk membuka dropdown
        self.category_dropdown.bind("<Button-1>", lambda e: self.category_dropdown._open_dropdown_menu())
        
        # Form Container
        form_container = ctk.CTkScrollableFrame(panel, fg_color="transparent")
        form_container.pack(fill="both", expand=True, padx=20, pady=10)
        self.form_frame = form_container
        
        # Send Button
        self.send_button = ctk.CTkButton(panel, text="🚀 Kirim ke Server", 
                                        height=40,
                                        font=ctk.CTkFont(size=14, weight="bold"),
                                        command=self._send_data,
                                        state="disabled",
                                        fg_color="#1976D2", hover_color="#0D47A1")
        self.send_button.pack(pady=20, padx=20, fill="x")

    def _create_file_list_panel(self, parent):
        panel = ctk.CTkFrame(parent, corner_radius=15)
        panel.grid(row=0, column=1, sticky="nsew", padx=10)
        
        # Title
        title_frame = ctk.CTkFrame(panel, fg_color="transparent")
        title_frame.pack(fill="x", pady=15, padx=20)
        
        ctk.CTkLabel(title_frame, text="📄 Daftar File", 
                    font=ctk.CTkFont(size=18, weight="bold")).pack(side="left")
        
        self.file_count_label = ctk.CTkLabel(title_frame, text="0 file", 
                                            font=ctk.CTkFont(size=12),
                                            text_color="gray")
        self.file_count_label.pack(side="right")
        
        # File List
        self.file_listbox = ctk.CTkScrollableFrame(panel)
        self.file_listbox.pack(fill="both", expand=True, padx=20, pady=(0, 20))
        
        self.file_buttons = []

    def _create_preview_panel(self, parent):
        panel = ctk.CTkFrame(parent, corner_radius=15)
        panel.grid(row=0, column=2, sticky="nsew", padx=(10, 0))
        
        # Title
        ctk.CTkLabel(panel, text="🖼️ Preview", 
                    font=ctk.CTkFont(size=18, weight="bold")).pack(pady=15, padx=20, anchor="w")
        
        # Preview Container
        preview_container = ctk.CTkFrame(panel, fg_color="#1a1a1a")
        preview_container.pack(fill="both", expand=True, padx=20, pady=(0, 20))
        
        self.preview_label = ctk.CTkLabel(preview_container, 
                                         text="Klik file untuk preview\n📸",
                                         font=ctk.CTkFont(size=14))
        self.preview_label.pack(fill="both", expand=True, pady=20)

    def _toggle_theme(self):
        current_mode = ctk.get_appearance_mode()
        new_mode = "light" if current_mode == "Dark" else "dark"
        ctk.set_appearance_mode(new_mode)

    def _select_folder(self):
        new_folder = filedialog.askdirectory(initialdir=self.folder_path.get())
        if new_folder:
            self.folder_path.set(new_folder)
            self._update_file_list()

    def _update_file_list(self):
        current_folder = self.folder_path.get()
        
        # Clear existing buttons
        for btn in self.file_buttons:
            btn.destroy()
        self.file_buttons.clear()
        
        if not os.path.isdir(current_folder):
            self.file_list = []
            self.file_count_label.configure(text="Folder tidak valid")
            return
        
        self.file_list = sorted([
            f for f in os.listdir(current_folder)
            if f.lower().endswith(('.jpg', '.jpeg')) and os.path.isfile(os.path.join(current_folder, f))
        ])
        
        self.file_count_label.configure(text=f"{len(self.file_list)} file")
        
        if not self.file_list:
            label = ctk.CTkLabel(self.file_listbox, text="📭 Tidak ada file JPG",
                               font=ctk.CTkFont(size=13), text_color="gray")
            label.pack(pady=20)
            self.file_buttons.append(label)
        else:
            for file_name in self.file_list:
                btn = ctk.CTkButton(self.file_listbox, text=f"📄 {file_name}",
                                   anchor="w", height=35,
                                   command=lambda f=file_name: self._preview_file(f),
                                   fg_color="transparent", 
                                   hover_color=("#3B8ED0", "#1F6AA5"))
                btn.pack(fill="x", pady=2, padx=5)
                self.file_buttons.append(btn)
        
        self._update_send_button_state()

    def _preview_file(self, file_name):
        file_path = os.path.join(self.folder_path.get(), file_name)
        
        if not os.path.exists(file_path):
            self.preview_label.configure(image=None, text="❌ File tidak ditemukan")
            return
        
        try:
            img = Image.open(file_path)
            img.thumbnail((450, 600), Image.LANCZOS)
            
            self.current_preview = ctk.CTkImage(light_image=img, dark_image=img, 
                                               size=img.size)
            self.preview_label.configure(image=self.current_preview, text="")
        except Exception as e:
            self.preview_label.configure(image=None, text=f"❌ Error: {str(e)[:50]}")

    def _generate_form(self, *args):
        for widget in self.form_frame.winfo_children():
            widget.destroy()
        self.form_entries.clear()
        
        category = self.selected_category.get()
        if not category:
            return
        
        fields = CATEGORY_CONFIG[category]["fields"]
        
        for field in fields:
            # Label
            ctk.CTkLabel(self.form_frame, text=field['label'], 
                        font=ctk.CTkFont(size=12)).pack(anchor="w", pady=(10, 5))
            
            # Widget berdasarkan type
            if field['type'] == 'date':
                # Date Picker dengan styling modern
                date_entry = DateEntry(self.form_frame,
                                      width=40,
                                      background='#1f538d',
                                      foreground='white',
                                      borderwidth=0,
                                      date_pattern='yyyy-mm-dd',
                                      font=('Segoe UI', 12),
                                      headersbackground='#144870',
                                      headersforeground='white',
                                      selectbackground='#1f538d',
                                      selectforeground='white',
                                      normalbackground='#2b2b2b',
                                      normalforeground='white',
                                      weekendbackground='#383838',
                                      weekendforeground='white',
                                      othermonthbackground='#1a1a1a',
                                      othermonthforeground='#666666',
                                      othermonthwebackground='#1a1a1a',
                                      othermonthweforeground='#666666',
                                      relief='flat',
                                      bd=0)
                date_entry.pack(fill="x", pady=(0, 5), ipady=10)
                
                # Style the date entry to match CTkEntry
                date_entry.configure(
                    disabledforeground='white',
                    disabledbackground='#343638'
                )
                
                self.form_entries[field['name']] = date_entry
                
            elif field['type'] == 'akta_format':
                # Auto-formatted Akta Entry
                entry = AktaFormattedEntry(self.form_frame, 
                                          placeholder_text=field.get('placeholder', ''),
                                          height=35)
                entry.pack(fill="x", pady=(0, 5))
                self.form_entries[field['name']] = entry
                
            else:
                # Regular Entry
                entry = ctk.CTkEntry(self.form_frame, 
                                   placeholder_text=field.get('placeholder', ''),
                                   height=35)
                entry.pack(fill="x", pady=(0, 5))
                self.form_entries[field['name']] = entry
        
        self._update_send_button_state()

    def _on_category_select(self, choice):
        self._generate_form()

    def _start_folder_monitoring(self):
        self._update_file_list()
        self.after(1000, self._start_folder_monitoring)

    def _update_send_button_state(self):
        if self.access_token and self.file_list:
            self.send_button.configure(state="normal")
        else:
            self.send_button.configure(state="disabled")

    def _get_entry_value(self, widget):
        """Helper untuk mengambil value dari berbagai jenis widget"""
        if isinstance(widget, DateEntry):
            return widget.get_date().strftime('%Y-%m-%d')
        else:
            return widget.get()

    def _validate_form(self, category_name, payload):
        config = CATEGORY_CONFIG.get(category_name)
        if not config:
            return False, "Kategori tidak valid."
        
        for field in config["fields"]:
            key = field['name']
            value = payload.get(key, "").strip()
            
            if not value:
                return False, f"Bidang '{field['label']}' wajib diisi."
            
            if key == 'noAkta' and category_name == 'Akta Kelahiran':
                if not re.fullmatch(r"\d{4}-[A-Z]{2}-\d{8}-\d{4}", value.upper()):
                    return False, "Format No. Akta tidak valid (Contoh: 3502-LU-31072002-0001)"
                payload[key] = value.upper()
            
            elif key == 'nik':
                if not re.fullmatch(r"\d{16}", value):
                    return False, "NIK harus 16 digit angka."
            
            elif key == 'tanggal':
                try:
                    time.strptime(value, '%Y-%m-%d')
                except ValueError:
                    return False, "Format tanggal: YYYY-MM-DD."
            
            elif key == 'noFisik':
                payload[key] = value.upper()
        
        return True, "Valid"

    def _authenticate(self):
        server_url = self.ip_address.get().strip().rstrip('/')
        login_url = f"{server_url}/auth/login"
        
        username = self.username.get()
        password = self.password.get()
        
        if not username or not password:
            messagebox.showerror("Error", "Username dan password wajib diisi!")
            return
        
        self.auth_status_label.configure(text="⏳ Login...", text_color="#FFC107")
        self.auth_button.configure(state="disabled")
        
        def do_auth():
            try:
                response = requests.post(login_url, json={"username": username, "password": password})
                
                if response.status_code == 200:
                    access_token = response.cookies.get('accessToken')
                    refresh_token = response.cookies.get('refreshToken')
                    
                    if access_token and refresh_token:
                        self.access_token = access_token
                        self.refresh_token = refresh_token
                        self.after(0, lambda: self.auth_status_label.configure(
                            text="✅ Login Sukses", text_color="#4CAF50"))
                    else:
                        self.after(0, lambda: self.auth_status_label.configure(
                            text="❌ Token Error", text_color="#F44336"))
                else:
                    self.after(0, lambda: self.auth_status_label.configure(
                        text="❌ Login Gagal", text_color="#F44336"))
                    self.after(0, lambda: messagebox.showerror("Error", "Login gagal!"))
            
            except Exception as e:
                self.after(0, lambda: self.auth_status_label.configure(
                    text="❌ Koneksi Gagal", text_color="#F44336"))
                self.after(0, lambda: messagebox.showerror("Error", f"Koneksi gagal: {e}"))
            
            finally:
                self.after(0, lambda: self.auth_button.configure(state="normal"))
                self.after(0, self._update_send_button_state)
        
        threading.Thread(target=do_auth, daemon=True).start()

    def _send_data(self):
        if not self.access_token:
            messagebox.showerror("Error", "Login terlebih dahulu!")
            return
        
        if not self.file_list:
            messagebox.showerror("Error", "Tidak ada file!")
            return
        
        category_name = self.selected_category.get()
        if not category_name:
            messagebox.showerror("Error", "Pilih kategori!")
            return
        
        # Collect form data
        payload_data = {}
        for key, widget in self.form_entries.items():
            payload_data[key] = self._get_entry_value(widget)
        
        is_valid, msg = self._validate_form(category_name, payload_data)
        if not is_valid:
            messagebox.showerror("Validasi Gagal", msg)
            return
        
        endpoint_slug = CATEGORY_CONFIG[category_name]["endpoint_slug"]
        server_url = self.ip_address.get().strip().rstrip('/')
        full_endpoint = f"{server_url}/{endpoint_slug}"
        
        files = []
        for file_name in self.file_list:
            file_path = os.path.join(self.folder_path.get(), file_name)
            try:
                files.append(('files', (file_name, open(file_path, 'rb'), 'image/jpeg')))
            except Exception as e:
                messagebox.showerror("Error", f"Gagal buka file: {e}")
                for _, ft in files:
                    ft[1].close()
                return
        
        self.send_button.configure(text="⏳ Mengirim...", state="disabled")
        threading.Thread(target=self._send_request_thread, 
                        args=(full_endpoint, payload_data, files, self.file_list.copy()),
                        daemon=True).start()

    def _send_request_thread(self, url, payload, files, file_names):
        def close_files():
            for _, ft in files:
                ft[1].close()
        
        try:
            cookies = {'accessToken': self.access_token}
            response = requests.post(url, data=payload, files=files, cookies=cookies)
            
            if response.status_code in [200, 201]:
                close_files()
                self.after(0, lambda: messagebox.showinfo("Sukses", "Data berhasil dikirim!"))
                self.after(0, lambda: self._handle_success(file_names, payload))
            else:
                close_files()
                error_msg = f"HTTP {response.status_code}"
                self.after(0, lambda: messagebox.showerror("Gagal", f"Gagal kirim: {error_msg}"))
                self.after(0, lambda: self.send_button.configure(text="🚀 Kirim ke Server", state="normal"))
        
        except Exception as e:
            close_files()
            self.after(0, lambda: messagebox.showerror("Error", f"Koneksi error: {e}"))
            self.after(0, lambda: self.send_button.configure(text="🚀 Kirim ke Server", state="normal"))

    def _handle_success(self, file_names, original_payload):
        # Delete files
        for file_name in file_names:
            file_path = os.path.join(self.folder_path.get(), file_name)
            try:
                os.remove(file_path)
            except Exception as e:
                messagebox.showwarning("Warning", f"Gagal hapus {file_name}: {e}")
        
        # Reset form (keep noFisik)
        no_fisik_value = original_payload.get('noFisik', '')
        for key, widget in self.form_entries.items():
            if key != 'noFisik':
                if isinstance(widget, DateEntry):
                    widget.set_date(datetime.now())
                else:
                    widget.delete(0, 'end')
            else:
                widget.delete(0, 'end')
                widget.insert(0, no_fisik_value)
        
        # Reset preview
        self.preview_label.configure(image=None, text="Klik file untuk preview\n📸")
        self.current_preview = None
        
        # Update list
        self._update_file_list()
        self.send_button.configure(text="🚀 Kirim ke Server", state="normal")


if __name__ == "__main__":
    app = ModernScannerApp()
    app.mainloop()