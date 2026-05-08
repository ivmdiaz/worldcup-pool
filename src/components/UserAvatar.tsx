interface Props {
  name: string | null;
  email: string;
  image: string | null;
}

export default function UserAvatar({ name, email, image }: Props) {
  const initials = (name ?? email)
    .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt={name ?? email} className="w-10 h-10 rounded-full object-cover shrink-0" />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
      <span className="text-sm font-bold text-stone-600">{initials}</span>
    </div>
  );
}
