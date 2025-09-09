export const translations = {
  en: {
    // Login Page
    loginTitle: "Login",
    loginDescription: "Enter your credentials to access your account",
    emailLabel: "Email",
    emailPlaceholder: "m@example.com",
    passwordLabel: "Password",
    forgotPasswordLink: "Forgot password?",
    departmentLabel: "Department",
    departmentPlaceholder: "Choose a department...",
    loginButton: "Login & Start Chat",
    noAccountPrompt: "Don't have an account?",
    signUpLink: "Sign up",
    selectDepartmentError: "Please select a department.",

    // Signup Page
    signupTitle: "Create an Account",
    signupDescription: "Enter your email and password to sign up",
    signupButton: "Sign Up",
    haveAccountPrompt: "Already have an account?",

    // Forgot Password Page
    forgotPasswordTitle: "Forgot Password",
    forgotPasswordDescription: "Enter your email to receive a reset link",
    sendResetLinkButton: "Send Reset Link",
    passwordResetSent: "Password reset email sent. Please check your inbox.",
    rememberPasswordPrompt: "Remember your password?",

    // Department Selector Page
    departmentSelectorTitle: "Select a department to start your conversation",
    welcomeUser: "Welcome, {email}",
    startChatButton: "Start Chat",
    signOutButton: "Sign Out",

    // Chat UI
    searchHistoryPlaceholder: "Search history...",
    newChatTooltip: "New Chat",
    signOutTooltip: "Sign Out",
    backButtonSr: "Back",
    thinkingMessage: "Thinking...",
    chatInputPlaceholder: "Type your question here...",
    attachFileSr: "Attach file",
    removeAttachmentSr: "Remove attachment",
    sendButtonSr: "Send",
    deleteChatTitle: "Are you absolutely sure?",
    deleteChatDescription: "This action cannot be undone. This will permanently delete this chat session.",
    cancelButton: "Cancel",
    continueButton: "Continue",
    
    // Welcome Message
    welcomeMessage: "Hello! How can I help you in the {department} today?",

    // Departments
    itDepartment: "IT Department",
    businessPlanningDepartment: "Business Planning Department",
    marketingDepartment: "Marketing Department",
    humanResources: "Human Resources",
    financeDepartment: "Finance Department",

    // Language Switcher
    languageSwitcherTooltip: "Change Language",
    vietnamese: "Vietnamese",
    english: "English",

    // Auth Pages Header/Footer
    companyName: "SaiGon Newport Corporation",
    companyCorps: "20th Corps",
    footerText: "© Copyright 2025 - SAIGON NEWPORT CORPORATION - IT Department",
  },
  vi: {
    // Login Page
    loginTitle: "Đăng nhập",
    loginDescription: "Nhập thông tin của bạn để truy cập tài khoản",
    emailLabel: "Email",
    emailPlaceholder: "m@example.com",
    passwordLabel: "Mật khẩu",
    forgotPasswordLink: "Quên mật khẩu?",
    departmentLabel: "Phòng ban",
    departmentPlaceholder: "Chọn một phòng ban...",
    loginButton: "Đăng nhập & Bắt đầu Trò chuyện",
    noAccountPrompt: "Chưa có tài khoản?",
    signUpLink: "Đăng ký",
    selectDepartmentError: "Vui lòng chọn một phòng ban.",

    // Signup Page
    signupTitle: "Tạo tài khoản",
    signupDescription: "Nhập email và mật khẩu của bạn để đăng ký",
    signupButton: "Đăng ký",
    haveAccountPrompt: "Đã có tài khoản?",

    // Forgot Password Page
    forgotPasswordTitle: "Quên mật khẩu",
    forgotPasswordDescription: "Nhập email của bạn để nhận liên kết đặt lại",
    sendResetLinkButton: "Gửi liên kết đặt lại",
    passwordResetSent: "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.",
    rememberPasswordPrompt: "Nhớ mật khẩu của bạn?",

    // Department Selector Page
    departmentSelectorTitle: "Chọn một phòng ban để bắt đầu cuộc trò chuyện của bạn",
    welcomeUser: "Chào mừng, {email}",
    startChatButton: "Bắt đầu Trò chuyện",
    signOutButton: "Đăng xuất",

    // Chat UI
    searchHistoryPlaceholder: "Tìm kiếm lịch sử...",
    newChatTooltip: "Trò chuyện mới",
    signOutTooltip: "Đăng xuất",
    backButtonSr: "Quay lại",
    thinkingMessage: "Đang nghĩ...",
    chatInputPlaceholder: "Nhập câu hỏi của bạn ở đây...",
    attachFileSr: "Đính kèm tệp",
    removeAttachmentSr: "Xóa tệp đính kèm",
    sendButtonSr: "Gửi",
    deleteChatTitle: "Bạn có chắc chắn không?",
    deleteChatDescription: "Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn phiên trò chuyện này.",
    cancelButton: "Hủy bỏ",
    continueButton: "Tiếp tục",

    // Welcome Message
    welcomeMessage: "Xin chào! Tôi có thể giúp gì cho bạn ở {department} hôm nay?",

    // Departments
    itDepartment: "Phòng Công nghệ thông tin",
    businessPlanningDepartment: "Phòng Kế hoạch kinh doanh",
    marketingDepartment: "Phòng Marketing",
    humanResources: "Phòng Nhân sự",
    financeDepartment: "Phòng Tài chính",
    
    // Language Switcher
    languageSwitcherTooltip: "Đổi ngôn ngữ",
    vietnamese: "Tiếng Việt",
    english: "Tiếng Anh",

    // Auth Pages Header/Footer
    companyName: "Tổng Công Ty Tân cảng Sài Gòn",
    companyCorps: "Binh Đoàn 20",
    footerText: "© Bản quyền 2025 - TỔNG CÔNG TY TÂN CẢNG SÀI GÒN-Phòng CÔNG NGHỆ THÔNG TIN",
  },
};

export type TranslationKey = keyof typeof translations.en;
