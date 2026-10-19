# Tóm tắt và đặc tả nền tảng
## Phần mềm bán quần áo và phụ kiện đa ngôn ngữ

> Tài liệu này được tổng hợp từ `BAOCAO.pdf`, phạm vi **Chương I đến Chương III**.
> Đây là tài liệu làm việc cho nhóm phát triển, không thay thế hoàn toàn báo cáo học
> thuật. Khi triển khai thực tế, mã nguồn và API phải được cập nhật để luôn khớp với
> các quy tắc trong tài liệu này.

---

## 0. Mục đích và cách sử dụng tài liệu

Tài liệu này nhằm:

- Giúp thành viên mới hiểu nhanh mục tiêu, phạm vi và kiến trúc hệ thống.
- Làm cơ sở chia service, chia module, thiết kế API và thiết kế cơ sở dữ liệu.
- Làm nguồn tham chiếu khi sửa yêu cầu hoặc mở rộng tính năng.
- Giảm tình trạng mỗi thành viên hiểu một quy tắc nghiệp vụ theo một cách khác nhau.
- Hỗ trợ viết test, tài liệu API, tài liệu triển khai và checklist nghiệm thu.

### Quy ước cập nhật

1. Mỗi yêu cầu mới phải có mã định danh, ví dụ `FR-14` hoặc `NFR-08`.
2. Khi sửa hành vi nghiệp vụ, cập nhật đồng thời:
   - Bảng yêu cầu.
   - Quy tắc nghiệp vụ.
   - Use case hoặc luồng xử lý liên quan.
   - API và mô hình dữ liệu bị ảnh hưởng.
   - Test case tương ứng.
3. Không dùng tên bảng hoặc tên service làm ràng buộc nếu chưa được nhóm thống nhất
   trong mã nguồn.
4. Những nội dung đánh dấu **Cần chốt** là quyết định chưa được báo cáo xác định
   hoàn toàn, cần thống nhất trước khi triển khai chính thức.

---

# CHƯƠNG I. TỔNG QUAN

## 1.1. Tên và mục tiêu hệ thống

Hệ thống là một phần mềm thương mại điện tử bán quần áo và phụ kiện, hỗ trợ hai
ngôn ngữ **Tiếng Việt** và **Tiếng Anh** trên cùng một website.

### Mục tiêu nghiệp vụ

- Cho phép khách hàng tìm kiếm, lọc và xem chi tiết sản phẩm.
- Cho phép khách hàng quản lý giỏ hàng và đặt hàng trực tuyến.
- Cho phép khách hàng theo dõi trạng thái đơn hàng và đánh giá sản phẩm.
- Cho phép quản trị viên quản lý sản phẩm, đơn hàng, tài khoản khách hàng và đánh giá.
- Hỗ trợ chuyển đổi ngôn ngữ mà không cần vận hành hai website riêng.
- Tự động gửi thông báo khi có các sự kiện quan trọng.

### Mục tiêu kỹ thuật

- Tách hệ thống thành các service độc lập theo nghiệp vụ.
- Cho phép từng service được phát triển, kiểm thử, triển khai và mở rộng riêng.
- Giảm phụ thuộc giữa các nhóm phát triển bằng REST/JSON và message queue.
- Có thể đóng gói môi trường chạy bằng Docker.
- Hỗ trợ kiểm thử API độc lập bằng Postman hoặc công cụ tương đương.

## 1.2. Đối tượng sử dụng

| Đối tượng | Mục đích sử dụng | Quyền chính |
|---|---|---|
| Customer | Mua sắm trên website | Đăng ký, đăng nhập, xem/lọc sản phẩm, quản lý giỏ, đặt hàng, đánh giá, theo dõi đơn |
| Admin | Vận hành cửa hàng | Quản lý sản phẩm, đơn hàng, tài khoản khách hàng, thống kê và duyệt đánh giá |

Mọi request có quyền truy cập phải được xác thực và kiểm tra role. Customer không
được truy cập các chức năng quản trị; Admin không mặc nhiên được sử dụng dữ liệu
không thuộc phạm vi quyền của mình nếu hệ thống sau này bổ sung nhiều cấp quản trị.

## 1.3. Phạm vi sử dụng

### Trong phạm vi

- Website SPA chạy bằng ReactJS.
- Trình duyệt phổ biến: Chrome, Edge và Firefox.
- Hiển thị responsive trên desktop và mobile web.
- Thị trường chính là Việt Nam, có hỗ trợ khách hàng nói tiếng Anh.
- Quản lý sản phẩm quần áo/phụ kiện, biến thể size/màu và tồn kho.
- Quản lý giỏ hàng, đơn hàng, trạng thái đơn và thông báo.

### Ngoài phạm vi hiện tại

- Không xây dựng ứng dụng Android/iOS riêng.
- Chưa xác định tích hợp cổng thanh toán trực tuyến.
- Chưa xác định đơn vị vận chuyển và cơ chế theo dõi vận đơn.
- Chưa mô tả đầy đủ chương trình khuyến mãi, mã giảm giá, hoàn tiền.
- Chưa mô tả cơ chế đăng nhập mạng xã hội, quên mật khẩu hoặc xác minh email.
- Chưa có yêu cầu chi tiết về báo cáo doanh thu, tồn kho nâng cao hoặc phân tích hành vi.

> Các mục ngoài phạm vi có thể trở thành backlog mở rộng, không nên tự ý đưa vào
> MVP nếu chưa được nhóm chốt.

## 1.4. Kiến trúc tổng thể

Hệ thống sử dụng kiến trúc **Microservices**. Frontend không gọi trực tiếp từng
service backend mà đi qua **API Gateway**.

```text
Browser / React SPA
        |
        v
API Gateway
  |      |       |       |       |
  v      v       v       v       v
User  Product  Cart   Order  Notification
 DB      DB      DB      DB       DB
                         |
                         v
                      RabbitMQ
```

### Các thành phần

| Thành phần | Trách nhiệm |
|---|---|
| Frontend | Hiển thị giao diện, quản lý trạng thái trình duyệt, gửi request qua Gateway, đổi ngôn ngữ |
| API Gateway | Cổng vào duy nhất, route request, kiểm tra JWT, chuyển tiếp language header, logging |
| User Service | Đăng ký, đăng nhập, JWT, profile và role Customer/Admin |
| Product Service | Sản phẩm, danh mục, biến thể, tồn kho, tìm kiếm, lọc, đánh giá |
| Cart Service | Giỏ hàng, item, số lượng và tạm tính |
| Order Service | Tạo đơn, lịch sử đơn, trạng thái đơn và thống kê |
| Notification Service | Nhận sự kiện và gửi thông báo trong ứng dụng/email |
| RabbitMQ | Giao tiếp bất đồng bộ cho các sự kiện không cần response ngay |

### Nguyên tắc kiến trúc

1. **Single Responsibility:** một service chỉ sở hữu một nhóm nghiệp vụ rõ ràng.
2. **Database per Service:** service chỉ truy cập trực tiếp database của mình.
3. **Loose Coupling:** giao tiếp qua REST/JSON hoặc message queue, không gọi trực tiếp
   class/module nội bộ của service khác.
4. **Independent Deployability:** service có thể build, test và deploy độc lập.
5. **API-first:** hợp đồng request/response phải được thống nhất trước khi frontend
   tích hợp.
6. **Fail independently:** lỗi Notification không được làm mất dữ liệu đơn hàng.

### Lợi ích và đánh đổi

**Lợi ích:** mở rộng từng service, phát triển song song, khoanh vùng lỗi, linh hoạt
công nghệ và triển khai độc lập.

**Đánh đổi:** nhiều service và database khó vận hành hơn, network call tạo độ trễ,
debug cần correlation ID, và các giao dịch liên service cần thiết kế nhất quán dữ liệu.

## 1.5. Công nghệ dự kiến

| Khu vực | Công nghệ trong báo cáo | Ghi chú triển khai |
|---|---|---|
| Frontend | ReactJS, SPA | Nên thống nhất một bộ UI/component và quy ước state management |
| i18n | i18next hoặc react-intl | Chọn một thư viện duy nhất, không trộn hai cơ chế |
| Backend | Node.js/Express hoặc Spring Boot | Cần chốt stack cho từng service và chuẩn coding chung |
| Database | MongoDB hoặc MySQL | Có thể khác nhau theo service nhưng phải thống nhất chiến lược vận hành |
| Auth | JWT | Password phải hash, không lưu plain text |
| Messaging | RabbitMQ | Dùng cho notification và các event bất đồng bộ |
| API test | Postman | Mỗi service cần collection và environment riêng |
| Version control | Git/GitHub | Branch, pull request và code review theo quy ước nhóm |
| Runtime | Docker | Mỗi service có Dockerfile và cấu hình môi trường riêng |

### Các quyết định cần chốt trước khi code sâu

- Node.js/Express hay Spring Boot là stack chính?
- MongoDB hay MySQL là database chính?
- Một repository chứa toàn bộ service hay mỗi service một repository?
- Frontend dùng i18next hay react-intl?
- JWT lưu ở cookie httpOnly hay storage của trình duyệt?
- Notification gửi in-app, email hay cả hai?
- Thanh toán và vận chuyển có thuộc phiên bản đầu tiên không?

---

# CHƯƠNG II. PHÂN TÍCH NỘI DUNG VÀ YÊU CẦU

## 2.1. Quy trình đăng ký và đăng nhập

### Đăng ký

1. Customer chọn **Đăng ký**.
2. Nhập họ tên, email, số điện thoại, mật khẩu và xác nhận mật khẩu.
3. Frontend kiểm tra dữ liệu cơ bản.
4. User Service kiểm tra email/số điện thoại đã tồn tại chưa.
5. Password được hash trước khi lưu.
6. Hệ thống tạo tài khoản role `Customer`.
7. Gửi thông báo đăng ký thành công.

### Đăng nhập

1. Người dùng nhập email và mật khẩu.
2. Frontend kiểm tra dữ liệu không rỗng và đúng định dạng.
3. User Service xác thực thông tin.
4. Hệ thống cấp JWT nếu hợp lệ.
5. Frontend điều hướng theo role:
   - Customer: khu vực mua sắm.
   - Admin: khu vực quản trị.
6. Nếu sai, chỉ hiển thị thông báo chung: **Sai email hoặc mật khẩu**.

### Quy tắc validate

| Trường | Quy tắc |
|---|---|
| Họ tên | Bắt buộc, tối đa 50 ký tự |
| Email | Bắt buộc, đúng định dạng, không trùng khi đăng ký |
| Số điện thoại | Đúng 10 chữ số, không trùng khi đăng ký |
| Mật khẩu | Tối thiểu 6 ký tự |
| Xác nhận mật khẩu | Phải trùng mật khẩu |

Không trả về lỗi phân biệt “email đúng nhưng mật khẩu sai” để tránh làm lộ thông tin
tài khoản. Validation ở frontend chỉ cải thiện trải nghiệm; backend vẫn phải validate
lại toàn bộ dữ liệu.

## 2.2. Quy trình giỏ hàng và đặt hàng

1. Customer xem sản phẩm và chọn biến thể size, màu, số lượng.
2. Customer thêm sản phẩm vào giỏ.
3. Cart Service lưu item và tính lại:

   ```text
   subtotal = SUM(unitPrice * quantity)
   ```

4. Customer có thể sửa số lượng hoặc xóa item.
5. Khi checkout, hệ thống kiểm tra:
   - Đã đăng nhập.
   - Giỏ không rỗng.
   - Sản phẩm còn đủ tồn kho tại thời điểm đặt.
   - Họ tên, số điện thoại và địa chỉ nhận hàng hợp lệ.
6. Order Service tạo đơn với trạng thái ban đầu `PENDING`.
7. Hệ thống phát event để Notification Service gửi thông báo.

### Dữ liệu giỏ hàng

- `cartId`
- `customerId`
- Danh sách item:
  - `productId`
  - tên sản phẩm hiển thị
  - `size`
  - `color`
  - `unitPrice`
  - `quantity`
- `totalQuantity`
- `subtotal`

> Đơn hàng nên lưu snapshot tên, giá, size và màu tại thời điểm mua. Không nên chỉ
> lưu `productId`, vì sản phẩm và giá có thể thay đổi sau khi đơn được tạo.

## 2.3. Vòng đời đơn hàng

Trạng thái chuẩn đề xuất:

```text
PENDING -> SHIPPING -> COMPLETED
    |          |
    +--------> CANCELLED
```

| Trạng thái | Ý nghĩa | Ai được chuyển |
|---|---|---|
| `PENDING` | Đã tạo, chờ xử lý | Hệ thống tạo đơn |
| `SHIPPING` | Đang giao | Admin |
| `COMPLETED` | Giao thành công | Admin |
| `CANCELLED` | Đã hủy | Customer hoặc Admin theo chính sách |

### Điểm cần chốt

Báo cáo có hai mô tả khác nhau:

- Bảng FR_10 nói Customer chỉ được hủy khi `PENDING`.
- Phần diễn giải trạng thái nói yêu cầu hủy có thể xuất phát từ `PENDING` hoặc
  `SHIPPING`, tùy chính sách.

**Đề xuất cho MVP:** chỉ cho Customer hủy `PENDING`; Admin có quyền hủy theo chính
  sách vận hành. Nếu cho phép hủy khi `SHIPPING`, cần bổ sung quy tắc hoàn hàng,
  hoàn tiền và xử lý tồn kho.

## 2.4. Yêu cầu chức năng của Customer

| Mã | Chức năng | Quy tắc nghiệm thu | Service |
|---|---|---|---|
| FR-01 | Đăng ký | Email/SĐT hợp lệ và chưa tồn tại; password >= 6 ký tự | User |
| FR-02 | Đăng nhập/đăng xuất | Xác thực và cấp JWT; role được kiểm tra | User |
| FR-03 | Xem sản phẩm | Hiển thị danh sách và chi tiết Việt/Anh | Product |
| FR-04 | Tìm kiếm/lọc | Lọc kết hợp từ khóa, giá, size, màu, loại | Product |
| FR-05 | Đánh giá | 1–5 sao; chỉ người đã mua và đơn `COMPLETED` được đánh giá | Product |
| FR-06 | Quản lý giỏ | Thêm, sửa, xóa; `0 < quantity <= stock` | Cart |
| FR-07 | Xem tổng tiền | `subtotal = SUM(unitPrice * quantity)` | Cart |
| FR-08 | Tạo đơn | Giỏ không rỗng, đủ kho, thông tin giao hàng hợp lệ | Order |
| FR-09 | Xem đơn | Chỉ xem đơn của chính tài khoản | Order |
| FR-10 | Hủy đơn | MVP: chỉ hủy khi `PENDING` | Order |
| FR-11 | Nhận thông báo | Nhận event đăng ký, đặt hàng và đổi trạng thái | Notification |
| FR-12 | Quản lý profile | Sửa họ tên/SĐT; không sửa email đăng nhập | User |
| FR-13 | Đổi mật khẩu | Xác thực password hiện tại; password mới >= 6 ký tự | User |

## 2.5. Yêu cầu chức năng của Admin

| Mã | Chức năng | Quy tắc nghiệm thu | Service |
|---|---|---|---|
| ADM-01 | Đăng nhập Admin | Chỉ role `Admin` được vào khu vực quản trị | User |
| ADM-02 | Thêm sản phẩm | Giá và tồn kho không âm; có nội dung Việt/Anh | Product |
| ADM-03 | Sửa sản phẩm | Cập nhật giá, tồn kho, mô tả và biến thể | Product |
| ADM-04 | Xóa/ngừng bán | Sản phẩm từng có trong đơn nên chuyển `INACTIVE`, không xóa cứng | Product |
| ADM-05 | Xem/lọc đơn | Lọc theo trạng thái | Order |
| ADM-06 | Cập nhật trạng thái | Tuân thủ state transition; phát notification event | Order |
| ADM-07 | Quản lý tài khoản | Tra cứu danh sách và chi tiết khách hàng | User |
| ADM-08 | Thống kê đơn | Đếm đơn theo từng trạng thái | Order |
| ADM-09 | Duyệt đánh giá | Ẩn spam hoặc nội dung vi phạm | Product |

## 2.6. Yêu cầu phi chức năng

| Mã | Nhóm | Mục tiêu |
|---|---|---|
| NFR-01 | Performance | API danh sách sản phẩm và giỏ phản hồi dưới 1–2 giây trong môi trường test |
| NFR-02 | Security | Password hash; JWT bắt buộc ở endpoint cần xác thực |
| NFR-03 | Scalability | Có thể scale-out từng service độc lập |
| NFR-04 | Maintainability | Tổ chức theo trách nhiệm đơn nhất; thay đổi một service không buộc build toàn bộ |
| NFR-05 | Availability | Notification lỗi không làm mất khả năng xem hàng hoặc đặt hàng |
| NFR-06 | Compatibility | Chrome, Edge, Firefox; responsive desktop/mobile |
| NFR-07 | Testability | API từng service test độc lập trước khi tích hợp frontend |

Các yêu cầu nên bổ sung khi phát triển thật:

- Correlation ID để trace một request qua Gateway và nhiều service.
- Timeout, retry có giới hạn và circuit breaker cho network call.
- Health check/readiness check cho từng service.
- Structured logging và không ghi JWT/password vào log.
- Pagination cho danh sách sản phẩm, đơn hàng và người dùng.
- Backup/restore và migration/seed dữ liệu.

## 2.7. Yêu cầu song ngữ và thông báo

### Nội dung cần dịch

- Menu và thanh điều hướng.
- Nút chức năng.
- Tiêu đề trang.
- Thông báo thành công/thất bại.
- Validation message.
- Tên và mô tả sản phẩm.
- Nội dung đánh giá mẫu hoặc gợi ý nếu có.

### Quy tắc i18n

- Tài nguyên tĩnh đặt trong `vi.json` và `en.json`.
- Không hard-code chuỗi giao diện trong component.
- Header `Accept-Language` hoặc giá trị tương đương được truyền qua Gateway.
- Đổi ngôn ngữ không yêu cầu đăng nhập lại.
- Đổi ngôn ngữ không làm mất giỏ hàng hoặc dữ liệu form đang thao tác.
- Tên/mô tả sản phẩm phải lấy đúng bản dịch Admin đã nhập, không tự dịch ngầm.

### Sự kiện thông báo

| Event | Nội dung |
|---|---|
| `USER_REGISTERED` | Chào mừng tạo tài khoản thành công |
| `ORDER_CREATED` | Đơn hàng được tạo thành công |
| `ORDER_SHIPPING` | Đơn hàng đang được giao |
| `ORDER_COMPLETED` | Đơn hàng đã giao thành công |
| `ORDER_CANCELLED` | Đơn hàng đã bị hủy |
| `REVIEW_SUBMITTED` | Đánh giá đã được ghi nhận |

---

# CHƯƠNG III. PHÂN TÍCH VÀ THIẾT KẾ

## 3.1. Định hướng thiết kế

Thiết kế là bản thiết kế logic làm nền cho triển khai. Địa chỉ API, tên trường,
framework cụ thể và giao diện có thể thay đổi, nhưng không được làm sai các yêu cầu
và quy tắc nghiệp vụ đã nêu.

Frontend giao tiếp với backend qua Gateway bằng REST/JSON. Các notification event
được phát bất đồng bộ qua RabbitMQ để giảm coupling và không chặn response chính.

## 3.2. Use case theo tác nhân

### Customer

- Đăng ký/đăng nhập/đăng xuất.
- Đổi ngôn ngữ.
- Xem danh sách và chi tiết sản phẩm.
- Tìm kiếm và lọc sản phẩm.
- Thêm, sửa, xóa giỏ hàng.
- Checkout và tạo đơn.
- Xem lịch sử, theo dõi và hủy đơn.
- Đánh giá sản phẩm đủ điều kiện.
- Xem/sửa profile và đổi mật khẩu.
- Nhận thông báo.

### Admin

- Đăng nhập quản trị.
- Thêm, sửa, ẩn/ngừng bán sản phẩm.
- Quản lý đơn và cập nhật trạng thái.
- Tra cứu tài khoản khách hàng.
- Xem thống kê trạng thái đơn.
- Duyệt hoặc ẩn đánh giá không phù hợp.

## 3.3. Luồng đặt hàng chi tiết

```text
Customer
  -> Frontend: chọn sản phẩm, size, màu, số lượng
  -> API Gateway: thêm item
  -> Cart Service: lưu item và tính subtotal
  -> Frontend: checkout
  -> API Gateway: tạo đơn
  -> Cart Service: xác nhận giỏ không rỗng
  -> Product Service: kiểm tra tồn kho gần thời điểm tạo đơn
  -> Order Service: tạo đơn PENDING và lưu snapshot
  -> RabbitMQ: publish ORDER_CREATED
  -> Notification Service: gửi thông báo
  -> Frontend: hiển thị kết quả
```

### Xử lý lỗi bắt buộc

- Giỏ rỗng: trả lỗi nghiệp vụ, không tạo đơn.
- Hết hoặc thiếu tồn kho: trả lỗi cho item cụ thể, không tạo đơn một phần.
- Token hết hạn: trả `401`, yêu cầu đăng nhập lại.
- Không đủ quyền: trả `403`.
- Notification lỗi: đơn vẫn phải được lưu; event cần retry hoặc dead-letter.
- Request tạo đơn lặp lại: cần idempotency key hoặc cơ chế chống tạo trùng.

## 3.4. Phân ranh giới service

### User Service

**Sở hữu:** tài khoản, thông tin đăng nhập, profile, role, password hash.

**Không sở hữu:** sản phẩm, giỏ hàng, đơn hàng hoặc dữ liệu notification.

### Product Service

**Sở hữu:** sản phẩm, danh mục, biến thể, giá, tồn kho và review.

**Không sở hữu:** password, cart hoặc trạng thái đơn.

### Cart Service

**Sở hữu:** cart của Customer và item trong cart.

**Không sở hữu:** nguồn giá/tồn kho chính thức. Khi checkout cần xác minh lại với
Product Service.

### Order Service

**Sở hữu:** order, order item snapshot, trạng thái, thông tin nhận hàng và thống kê.

**Không sở hữu:** truy cập trực tiếp database của User/Product/Cart.

### Notification Service

**Sở hữu:** notification, trạng thái gửi, retry/dead-letter nếu cần.

**Không được:** làm transaction chính của đặt hàng bị rollback chỉ vì gửi thông báo lỗi.

## 3.5. Thiết kế dữ liệu logic

### User DB

```text
User
- id
- fullName
- email (unique)
- phone (unique)
- passwordHash
- role: CUSTOMER | ADMIN
- status
- createdAt
- updatedAt
```

### Product DB

```text
Product
- id
- nameVi
- nameEn
- descriptionVi
- descriptionEn
- categoryId
- price
- images[]
- status: ACTIVE | INACTIVE
- createdAt
- updatedAt

ProductVariant
- id
- productId
- size
- color
- stockQuantity
```

```text
Review
- id
- productId
- customerId
- orderId
- rating: 1..5
- comment
- status: VISIBLE | HIDDEN | PENDING
- createdAt
```

### Cart DB

```text
Cart
- id
- customerId (unique cho cart đang hoạt động)
- items[]
- updatedAt

CartItem
- productId
- variantId
- productNameSnapshot
- size
- color
- unitPrice
- quantity
```

### Order DB

```text
Order
- id
- customerId
- receiverName
- receiverPhone
- shippingAddress
- items[]
- subtotal
- status: PENDING | SHIPPING | COMPLETED | CANCELLED
- createdAt
- updatedAt
- cancelledAt?
```

```text
OrderItem
- productId
- variantId
- productNameSnapshot
- size
- color
- unitPrice
- quantity
```

### Notification DB

```text
Notification
- id
- recipientId
- eventType
- titleVi
- titleEn
- messageVi
- messageEn
- readAt?
- deliveryStatus
- createdAt
```

### Quy tắc dữ liệu

- Không lưu password dạng plain text.
- Các service dùng ID để tham chiếu; không join database trực tiếp giữa service.
- Tiền nên dùng kiểu decimal/integer theo đơn vị nhỏ nhất, tránh sai số floating point.
- Giá và thông tin sản phẩm trong OrderItem là snapshot tại thời điểm đặt.
- Sản phẩm đã xuất hiện trong đơn không nên xóa cứng.
- Tồn kho phải được kiểm tra sát thời điểm tạo đơn để giảm overselling.
- Cần chốt chiến lược transaction khi Product và Order nằm ở hai service khác nhau.

## 3.6. Thiết kế giao diện

| Màn hình | Thành phần | Hành động |
|---|---|---|
| Đăng nhập/Đăng ký | Logo, language switcher, form, lỗi validation | Đăng nhập, tạo tài khoản |
| Danh sách sản phẩm | Search, filter giá/size/màu/loại, product card | Tìm kiếm, lọc, mở chi tiết |
| Chi tiết sản phẩm | Ảnh, bản dịch, giá, biến thể, tồn kho, review | Chọn biến thể, thêm giỏ |
| Giỏ hàng/Checkout | Item, số lượng, subtotal, thông tin nhận hàng | Sửa, xóa, đặt hàng |
| Lịch sử đơn | Mã đơn, ngày, tổng tiền, trạng thái | Xem chi tiết, yêu cầu hủy |
| Admin | Sản phẩm, đơn, user, review, dashboard | CRUD/ẩn, đổi trạng thái, tra cứu |

### Quy tắc UI

- Component dùng lại cho nút, input, card, modal, table và notification.
- Lỗi hiển thị gần field bị lỗi.
- Loading, empty state và error state phải có thiết kế riêng.
- Không mất dữ liệu đang nhập khi đổi ngôn ngữ.
- Responsive trước khi tối ưu chi tiết từng breakpoint.
- Route quản trị phải được bảo vệ ở frontend và backend; frontend guard không thay thế
  backend authorization.

## 3.7. API logic ban đầu

Đây là danh mục định hướng, cần chuyển thành OpenAPI trước khi code tích hợp.

| Method | Endpoint | Auth | Service |
|---|---|---|---|
| POST | `/api/auth/register` | Public | User |
| POST | `/api/auth/login` | Public | User |
| GET | `/api/products` | Public | Product |
| GET | `/api/products/{id}` | Public | Product |
| POST | `/api/products` | Admin | Product |
| PUT | `/api/products/{id}` | Admin | Product |
| DELETE/PATCH | `/api/products/{id}` | Admin | Product |
| GET | `/api/cart` | Customer | Cart |
| POST | `/api/cart/items` | Customer | Cart |
| PATCH | `/api/cart/items/{id}` | Customer | Cart |
| DELETE | `/api/cart/items/{id}` | Customer | Cart |
| POST | `/api/orders` | Customer | Order |
| GET | `/api/orders` | Customer/Admin | Order |
| GET | `/api/orders/{id}` | Owner/Admin | Order |
| PATCH | `/api/orders/{id}/status` | Admin | Order |
| POST | `/api/orders/{id}/cancel` | Customer/Admin | Order |
| POST | `/api/products/{id}/reviews` | Customer | Product |
| PATCH | `/api/reviews/{id}/moderation` | Admin | Product |
| GET | `/api/notifications` | Customer | Notification |

Mọi API nên thống nhất:

```json
{
  "data": {},
  "message": "Success",
  "errorCode": null,
  "traceId": "..."
}
```

Tên response có thể thay đổi, nhưng cần thống nhất pagination, error code, date format,
language và quy tắc HTTP status trước khi frontend gọi API.

## 3.8. Ma trận truy vết

| Nhu cầu | Use case | Service | Dữ liệu chính | Test tối thiểu |
|---|---|---|---|---|
| Đăng nhập an toàn | Đăng nhập | User/Gateway | User, JWT | Sai mật khẩu không lộ chi tiết |
| Mua sản phẩm | Đặt hàng | Cart/Product/Order | Cart, Variant, Order | Hết kho không tạo đơn |
| Theo dõi đơn | Xem đơn | Order | Order | Customer không xem đơn người khác |
| Quản lý bán hàng | Cập nhật trạng thái | Order/Notification | Order, Event | Sai transition bị từ chối |
| Song ngữ | Đổi ngôn ngữ | Frontend/Gateway/Product | Translation fields | Đổi ngôn ngữ không mất state |
| Đánh giá | Gửi/duyệt review | Product | Review, Order snapshot | Chưa mua/chưa hoàn tất không đánh giá |

---

# 4. Các điểm chưa hoàn tất cần chốt

Danh sách này được tách riêng để nhóm dễ biến thành issue/task:

- [ ] Chốt backend framework cho từng service.
- [ ] Chốt MongoDB hoặc MySQL và chiến lược migration.
- [ ] Chốt cấu trúc repository và quy tắc branch.
- [ ] Chốt trạng thái đơn và quyền hủy ở trạng thái `SHIPPING`.
- [ ] Chốt cơ chế reserve/release tồn kho khi tạo hoặc hủy đơn.
- [ ] Chốt thanh toán: chưa có, COD hay tích hợp gateway.
- [ ] Chốt giao vận: chỉ lưu địa chỉ hay tích hợp đơn vị vận chuyển.
- [ ] Chốt cách lưu bản dịch sản phẩm: cột riêng, JSON hay translation table.
- [ ] Chốt nơi lưu JWT và thời hạn access/refresh token.
- [ ] Chốt kênh notification: in-app, email hoặc cả hai.
- [ ] Chốt pagination, sort và filter contract cho Product/Order.
- [ ] Chốt chuẩn lỗi, HTTP status và `errorCode`.
- [ ] Chốt logging, tracing, health check và monitoring.
- [ ] Chốt mức test: unit, integration, contract và end-to-end.

# 5. Thứ tự phát triển đề xuất

## Giai đoạn 1: Nền tảng

1. Tạo cấu trúc repository và quy ước môi trường.
2. Dựng API Gateway.
3. Dựng User Service: register, login, JWT, role.
4. Dựng React shell, routing và i18n.

## Giai đoạn 2: Sản phẩm và giỏ hàng

1. Product Service và dữ liệu seed.
2. Danh sách, chi tiết, tìm kiếm và lọc.
3. Cart Service.
4. Giao diện giỏ hàng.

## Giai đoạn 3: Đặt hàng

1. Order Service và state machine.
2. Checkout và kiểm tra tồn kho.
3. Lưu snapshot OrderItem.
4. Test luồng đặt hàng và chống tạo đơn trùng.

## Giai đoạn 4: Thông báo và quản trị

1. RabbitMQ/event contract.
2. Notification Service.
3. Admin CRUD sản phẩm.
4. Admin quản lý đơn, user và review.

## Giai đoạn 5: Chất lượng và vận hành

1. Docker Compose cho local development.
2. Postman/OpenAPI.
3. Unit/integration/E2E test.
4. Logging, health check, retry và dead-letter.
5. Kiểm thử hiệu năng và responsive.

# 6. Checklist nghiệm thu MVP

- [ ] Customer đăng ký và đăng nhập thành công.
- [ ] Admin đăng nhập và bị giới hạn đúng role.
- [ ] Danh sách/chi tiết sản phẩm hiển thị được Việt/Anh.
- [ ] Tìm kiếm và lọc kết hợp hoạt động.
- [ ] Thêm/sửa/xóa giỏ hàng tính đúng subtotal.
- [ ] Không thể đặt đơn khi giỏ rỗng hoặc thiếu tồn kho.
- [ ] Đơn mới có trạng thái `PENDING`.
- [ ] Chuyển trạng thái sai bị từ chối.
- [ ] Customer chỉ xem được đơn của mình.
- [ ] Password không xuất hiện dạng plain text trong DB/log.
- [ ] Notification lỗi không làm mất đơn đã tạo.
- [ ] Sản phẩm đã bán không bị xóa làm mất lịch sử đơn.
- [ ] Giao diện hoạt động trên Chrome, Edge, Firefox và mobile viewport.
- [ ] Có API collection hoặc OpenAPI để test từng service.
- [ ] Có Docker Compose hoặc hướng dẫn chạy local tái lập được.

---

## Nguồn và phạm vi

- Nguồn chính: `BAOCAO.pdf`, Chương I, II và III.
- Các tên trạng thái viết hoa trong tài liệu này (`PENDING`, `SHIPPING`,
  `COMPLETED`, `CANCELLED`) là tên kỹ thuật đề xuất tương ứng với tên tiếng Việt
  trong báo cáo.
- Các phần “Cần chốt”, “Đề xuất” và “Thứ tự phát triển” là phần chuẩn hóa phục vụ
  phát triển app, cần được nhóm xác nhận trước khi xem là yêu cầu chính thức.
