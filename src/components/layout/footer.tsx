import Image from "next/image";

type FooterLink = {
  name: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

type FooterSocialLink = {
  icon: React.ReactNode;
  href: string;
  label: string;
};

type FooterLogo = {
  url: string;
  src: string;
  alt: string;
  title: string;
};

type FooterProps = {
  logo?: FooterLogo;
  sections?: FooterSection[];
  description?: string;
  socialLinks?: FooterSocialLink[];
  copyright?: string;
  legalLinks?: FooterLink[];
};

// Default Vietnamese translations
const defaultSections: FooterSection[] = [
  {
    title: "Sản phẩm",
    links: [
      { name: "Tổng quan", href: "#" },
      { name: "Bảng giá", href: "#" },
      { name: "Chợ", href: "#" },
      { name: "Tính năng", href: "#" },
    ],
  },
  {
    title: "Công ty",
    links: [
      { name: "Giới thiệu", href: "#" },
      { name: "Đội ngũ", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Tuyển dụng", href: "#" },
    ],
  },
  {
    title: "Tài nguyên",
    links: [
      { name: "Trợ giúp", href: "#" },
      { name: "Bán hàng", href: "#" },
      { name: "Quảng cáo", href: "#" },
      { name: "Riêng tư", href: "#" },
    ],
  },
];

const defaultLegalLinks: FooterLink[] = [
  { name: "Điều khoản & Điều kiện", href: "#" },
  { name: "Chính sách bảo mật", href: "#" },
];

const defaultLogo: FooterLogo = {
  url: "https://www.rentalmap.vn",
  src: "/logo.svg",
  alt: "logo",
  title: "Rental Map",
};

export default function Footer({
  logo = defaultLogo,
  sections = defaultSections,
  description = "Nền tảng tìm kiếm phòng cho thuê hoàn hảo dành cho bạn.",
  copyright = "© 2024 Rental Map. Đã đăng ký bản quyền.",
  legalLinks = defaultLegalLinks,
}: FooterProps) {
  // You can override default content using i18n keys if needed.
  // Here we use hard-coded Vietnamese defaults as fallback (from above).
  return (
    <section className="py-32 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            {/* Logo */}
            <div className="flex items-center gap-2 lg:justify-start">
              <a href={logo.url}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </a>
            </div>
            <p className="text-primary-foreground/80 max-w-[70%] text-sm">
              {description}
            </p>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-primary-foreground">
                  {section.title}
                </h3>
                <ul className="text-primary-foreground/80 space-y-3 text-sm">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="hover:text-primary-foreground font-medium transition-colors"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="text-primary-foreground/80 mt-8 flex flex-col justify-between gap-4 border-t border-primary-foreground/20 py-8 text-xs font-medium md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li
                key={idx}
                className="hover:text-primary-foreground transition-colors"
              >
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
