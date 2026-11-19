TOOLNOVA v1.0 - HƯỚNG DẪN
=========================

Website tĩnh (HTML/CSS/JavaScript), không cần máy chủ, không cần cơ sở dữ liệu.
Có 10 công cụ, giao diện sáng, tiếng Việt/tiếng Anh, tìm kiếm và lọc theo nhóm.

1. CẤU TRÚC THƯ MỤC
-------------------
index.html            Trang chủ
tools/<ten>/index.html  10 trang công cụ (mỗi công cụ một địa chỉ riêng cho SEO)
about/ contact/ privacy/ terms/   Giới thiệu, Liên hệ, Chính sách bảo mật, Điều khoản
404.html              Trang báo lỗi
css/style.css         Giao diện
js/data.js            TOÀN BỘ nội dung chữ (Việt + Anh), danh sách công cụ, đơn vị đo
js/app.js             Chuyển ngôn ngữ, tìm kiếm, menu
js/tools.js           Mã của 10 công cụ
build.js              Tạo lại các trang HTML (tùy chọn, cần Node.js trên máy tính)
sitemap.xml robots.txt ads.txt favicon.svg

2. ĐƯA WEBSITE LÊN MẠNG BẰNG ĐIỆN THOẠI ANDROID (miễn phí)
----------------------------------------------------------
Cách A - Cloudflare Pages + GitHub:
  1) Giải nén file ZIP.
  2) Vào github.com, tạo repository tên toolnova-site.
  3) Upload TOÀN BỘ file và thư mục bên trong thư mục toolnova (giữ nguyên cấu trúc).
  4) Vào dash.cloudflare.com -> Workers & Pages -> Create -> Pages -> Connect to Git.
  5) Chọn repository toolnova-site.
  6) Build command: để TRỐNG. Output directory: để TRỐNG hoặc "/". Bấm Deploy.
  7) Sau vài phút bạn có địa chỉ dạng toolnova-site.pages.dev.

Cách B - Cloudflare Pages tải trực tiếp: Create -> Pages -> Upload assets, tải thư mục lên.
(Một số trình duyệt điện thoại không tải được thư mục; khi đó hãy dùng cách A.)

Lưu ý: thư mục phải có index.html ở GỐC. Nếu sau khi upload bạn thấy index.html nằm trong
một thư mục con, hãy di chuyển nội dung ra ngoài.

3. VIỆC CẦN LÀM TRƯỚC KHI XIN QUẢNG CÁO
---------------------------------------
[ ] Thay email liên hệ: sửa "email" trong js/data.js (dòng site = {...}).
    Sau đó chạy lại build.js (xem mục 4) hoặc sửa tay trong contact/index.html.
[ ] Thay tên miền mẫu "toolnova.example":
    - Có Node.js:  SITE_URL=https://tenmiencuaban.com node build.js
      (ghi tên miền thật vào canonical, sitemap.xml, robots.txt)
    - Không có Node.js: mở sitemap.xml và robots.txt, thay toolnova.example bằng tên miền thật.
[ ] Thử cả 10 công cụ trên điện thoại thật, ở cả hai ngôn ngữ.
[ ] Đăng ký Google Search Console, gửi sitemap.xml.
[ ] Gắn Google Analytics: dán thẻ gtag.js vào vị trí có chú thích GOOGLE ANALYTICS trong <head>
    (hoặc sửa build.js rồi chạy lại để áp dụng cho mọi trang).
[ ] Viết thêm nội dung hướng dẫn cho từng công cụ (xem js/data.js, mục faq và s).
[ ] Dùng tên miền riêng (nên có) trước khi đăng ký AdSense.
[ ] Cập nhật Chính sách bảo mật cho đúng thực tế khi bật quảng cáo / thống kê.

4. CHỈNH SỬA NỘI DUNG
---------------------
- Mọi chữ hiển thị nằm trong js/data.js (phần i18n, PAGES, T).
- Sau khi sửa data.js, chạy:   node build.js
  để tạo lại toàn bộ trang HTML (tiêu đề, mô tả SEO, nội dung tiếng Việt hiển thị đầu tiên).
- Bản tiếng Anh được áp dụng bằng JavaScript khi người dùng bấm nút EN.
- Thêm công cụ mới: thêm mục vào tools[] và T{} trong data.js, thêm hàm TN.tools.<id> trong tools.js,
  rồi chạy node build.js.

5. QUẢNG CÁO GOOGLE ADSENSE
---------------------------
Bản 1.0 CHƯA có mã quảng cáo. Mỗi trang đã có sẵn các vị trí (div class="ad-slot") ở đầu,
giữa, cuối trang công cụ và trang chủ. Các vị trí này trống nên không chiếm chỗ.
Sau khi AdSense duyệt:
  1) Dán mã script AdSense vào <head> (vị trí chú thích GOOGLE ADSENSE).
  2) Dán mã khối quảng cáo vào giữa thẻ div.ad-slot mong muốn.
  3) Mở file ads.txt, bỏ dấu # và thay pub-XXXXXXXXXXXXXXXX bằng mã của bạn.
AdSense yêu cầu website có nội dung đủ giá trị, trang Chính sách bảo mật, và tuân thủ chính sách
của Google. Việc được duyệt không được bảo đảm; hãy bổ sung thêm nội dung hữu ích trước khi đăng ký.

6. LƯU Ý KỸ THUẬT
-----------------
- Chạy thử trên máy: trong thư mục toolnova gõ  python3 -m http.server 8000
  rồi mở http://localhost:8000 (không nên mở file index.html trực tiếp vì các liên kết dạng thư mục
  cần máy chủ).
- Công cụ Tạo mã QR cần Internet ở lần đầu để tải thư viện qrcode-generator 1.4.4 từ cdnjs
  (dự phòng jsDelivr). Muốn chạy hoàn toàn ngoại tuyến: tải file qrcode.min.js của thư viện này và
  đặt vào js/vendor/qrcode.min.js; website sẽ ưu tiên dùng file đó.
- 9 công cụ còn lại xử lý hoàn toàn trên thiết bị, không gửi dữ liệu đi.
- Nén ảnh: tối đa 20 ảnh mỗi lần; ảnh quá lớn trên điện thoại cũ có thể chậm.
- Ngôn ngữ người dùng chọn được lưu trong localStorage của trình duyệt.

7. ĐÃ KIỂM THỬ
--------------
- Logic 10 công cụ (đếm từ, đổi kiểu chữ, mật khẩu, đổi đơn vị, phần trăm, BMI, JSON, Base64/URL)
  bằng bộ kiểm thử tự động.
- Giao diện trên Chromium giả lập Pixel 7: tìm kiếm, lọc, chuyển ngôn ngữ, menu, từng công cụ,
  nén ảnh (JPEG/WebP), không tràn ngang màn hình.
- QR: đường vẽ và tải PNG đã kiểm thử bằng thư viện thay thế; việc tải thư viện thật từ CDN
  chưa kiểm tra được trong môi trường không có Internet. Hãy thử công cụ này sau khi đưa lên mạng.
