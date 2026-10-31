import { InfoHero, InfoPage } from './infoUi'

// Mahdollistajat, carried over from the laptop site (LaudaturAkatemia-main).
// Every slot is still an open invitation; replace entries as partners join.

interface Partner {
  name: string
  description: string
  image: string
  category: string
}

const OPEN_SLOT: Partner = {
  name: 'Sinun yrityksesi?',
  description:
    'Haluaisitko sinä, tai yrityksesi tukea nuorten opiskelua ja samalla saada mainosta ja näkyvyyttä yrityksellesi? Ota yhteyttä!',
  image: '/brand/logo.png',
  category: 'Toimiala',
}

const PARTNERS: Partner[] = Array.from({ length: 6 }, () => OPEN_SLOT)

const CONTACT_EMAIL = 'lauri.paloneva556@gmail.com'

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-video overflow-hidden bg-page">
        <img
          src={partner.image}
          alt={`${partner.name} logo`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <span className="mb-2 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          {partner.category}
        </span>
        <h3 className="mb-3 text-xl font-semibold text-ink transition-colors group-hover:text-accent">{partner.name}</h3>
        <p className="mb-4 text-sm leading-relaxed text-ink-dim">{partner.description}</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="flex w-full items-center justify-center rounded-xl border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-accent hover:bg-accent hover:text-white"
        >
          Ole yhteydessä
        </a>
      </div>
    </div>
  )
}

export default function MahdollistajatPage() {
  return (
    <InfoPage>
      <InfoHero title="Mahdollistajamme">
        <p>
          Laudatur akatemia etsii kumppaneita mahdollistamaan sen arvojen mukaista toimintaa: Antamaan kaikille
          tasa-arvoiset mahdollisuudet oppia ja kehittyä.
        </p>
        <p className="text-base text-ink-dim">
          Olemme avoimia kaikille yhteistyömahdollisuuksille, jotka tukevat arvojamme. Ota rohkeasti yhteyttä, niin
          keskustellaan lisää!
        </p>
      </InfoHero>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {PARTNERS.map((partner, index) => (
          <PartnerCard key={index} partner={partner} />
        ))}
      </div>
    </InfoPage>
  )
}
