import os

def build_index():
    print("Building index.html from partials...")
    
    partials_dir = "partials"
    output_file = "../index.html"
    
    # Danh sách các file cấu thành index.html theo đúng thứ tự
    files_to_merge = [
        "01-head.html",
        "02-header.html",
        "03-hero.html",
        "04-category.html",
        "05-product-grid.html",
        "05b-other-pages.html",
        "06-modals-auth.html",
        "07-modals-admin.html",
        "08-modals-checkout.html",
        "09-scripts.html",
        "10-footer.html"
    ]
    
    full_html = "<!DOCTYPE html>\n<html lang=\"vi\">\n<head>\n"
    
    try:
        # 1. Head
        with open(os.path.join(partials_dir, "01-head.html"), 'r', encoding='utf-8') as f:
            full_html += f.read() + "\n</head>\n<body>\n\n"
            
        # 2 -> 10. Body components
        for filename in files_to_merge[1:]:
            filepath = os.path.join(partials_dir, filename)
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    full_html += f.read() + "\n\n"
            else:
                print(f"Warning: {filename} not found!")
                
        full_html += "</body>\n</html>"
        
        # Write output
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(full_html)
            
        print(f"Successfully built {output_file}!")
        
    except Exception as e:
        print(f"Error building index.html: {e}")

if __name__ == "__main__":
    # Đảm bảo script chạy từ thư mục chứa file build.py (thư mục src)
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    build_index()
