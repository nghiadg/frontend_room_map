import Image from "next/image";

type FooterLogo = {
  url: string;
  src: string;
  alt: string;
  title: string;
};

type FooterContact = {
  email: string;
};

type FooterCTA = {
  label: string;
  href: string;
};

type FooterIntro = {
  heading: string;
  body: string;
  highlights: string[];
};

type FooterLink = {
  name: string;
  href: string;
};

type FooterProps = {
  logo?: FooterLogo;
  description?: string;
  intro?: FooterIntro;
  contact?: FooterContact;
  cta?: FooterCTA;
  links?: FooterLink[];
  copyright?: string;
};

const defaultLogo: FooterLogo = {
  url: "https://www.rentalmap.vn",
  src: "/logo.webp",
  alt: "logo",
  title: "Rental Map",
};

const defaultContact: FooterContact = {
  email: "support@rentalmap.vn",
};

const defaultCTA: FooterCTA = {
  label: "Khám phá bản đồ",
  href: "/map",
};

const defaultIntro: FooterIntro = {
  heading: "Bản đồ dữ liệu phòng trọ theo thời gian thực",
  body: "Rental Map giúp bạn theo sát thị trường cho thuê tại Việt Nam với dữ liệu được xác thực, cập nhật liên tục và hiển thị trực quan trên bản đồ.",
  highlights: [
    "Định vị nhanh khu vực phù hợp và giá thuê trung bình",
    "Nguồn tin từ chủ nhà, môi giới uy tín đã được thẩm định",
    "Hàng nghìn người thuê sử dụng để ra quyết định mỗi tháng",
  ],
};

const defaultLinks: FooterLink[] = [
  { name: "Điều khoản sử dụng", href: "#" },
  { name: "Chính sách bảo mật", href: "#" },
  { name: "Liên hệ hỗ trợ", href: "#" },
];

export default function Footer({
  logo = defaultLogo,
  description = "Nền tảng tìm kiếm phòng cho thuê hoàn hảo dành cho bạn.",
  intro,
  contact = defaultContact,
  cta = defaultCTA,
  links = defaultLinks,
  copyright = "© 2024 Rental Map. Đã đăng ký bản quyền.",
}: FooterProps) {
  const resolvedIntro: FooterIntro = intro ?? {
    ...defaultIntro,
    body: description || defaultIntro.body,
  };
  const introHeading = resolvedIntro.heading
    .toLowerCase()
    .includes("rental map")
    ? resolvedIntro.heading
    : `Rental Map • ${resolvedIntro.heading}`;
  const highlightParagraph =
    resolvedIntro.highlights.length > 0
      ? `${resolvedIntro.highlights.join(". ")}.`
      : "";

  // Giữ footer gọn gàng: thông tin giới thiệu & liên hệ bên trái, menu cần thiết bên phải.
  return (
    <section className="bg-[#0F172A] py-16">
      <div className="container mx-auto flex flex-col gap-10 px-4">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col items-start gap-4">
              <a href={logo.url}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </a>
              <div className="flex w-full flex-col gap-2 text-primary-foreground/80 text-sm max-w-lg">
                <h4 className="text-primary-foreground text-base font-semibold">
                  {introHeading}
                </h4>
                <p>{resolvedIntro.body}</p>
                {highlightParagraph && (
                  <p className="text-primary-foreground/70 text-xs leading-relaxed">
                    {highlightParagraph}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="text-primary-foreground/80 flex flex-col gap-6 text-sm md:w-2/5">
            <div className="flex flex-col gap-6 md:flex-row md:gap-10">
              <div className="flex flex-1 flex-col gap-2">
                <span className="text-primary-foreground font-semibold">
                  Liên hệ nhanh
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-primary-foreground transition-colors"
                >
                  {contact.email}
                </a>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <span className="text-primary-foreground font-semibold">
                  Thông tin cần thiết
                </span>
                <ul className="space-y-2">
                  {links.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.href}
                        className="hover:text-primary-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-primary-foreground/20 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-primary-foreground/70 text-xs">{copyright}</p>
          <a
            href={cta.href}
            className="text-primary-foreground inline-flex items-center justify-center rounded-full border border-primary-foreground/30 px-5 py-2 text-sm font-semibold transition-all hover:border-primary-foreground hover:bg-white/10"
          >
            {cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
