import type { Helpline } from "@/types";
import { HeartHandshakeIcon, PhoneIcon } from "@/components/icons";

type Props = {
  message: string;
  helplines: Helpline[];
};

export default function CrisisCard({ message, helplines }: Props) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-3xl border-2 border-amber-300 bg-amber-50 p-6 space-y-4"
    >
      <div className="flex items-start gap-3">
        <span className="grid place-items-center w-9 h-9 flex-shrink-0 rounded-xl bg-amber-200 text-amber-700" aria-hidden="true">
          <HeartHandshakeIcon size={20} />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-amber-900">
            You don&apos;t have to face this alone
          </h2>
          <p className="mt-1 text-amber-800 text-sm leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-amber-900">
          Free, confidential support is available right now:
        </p>
        {helplines.map((h) => (
          <div
            key={h.number}
            className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-amber-200"
          >
            <div>
              <p className="font-semibold text-slate-800">{h.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{h.hours}</p>
            </div>
            <a
              href={`tel:${h.number}`}
              className="flex items-center gap-2 min-h-[44px] bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
              aria-label={`Call ${h.name} at ${h.number}`}
            >
              <PhoneIcon size={16} />
              <span>{h.number}</span>
            </a>
          </div>
        ))}
      </div>

      <p className="text-xs text-amber-700 text-center border-t border-amber-200 pt-3">
        If you are in immediate danger, please call emergency services{" "}
        <a
          href="tel:112"
          className="font-semibold underline hover:text-amber-900"
        >
          112
        </a>
      </p>
    </div>
  );
}
