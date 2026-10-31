import { ContactLinks, InfoCard, InfoHero, InfoPage, InfoSection } from './infoUi'

// Etusivu › Esittely, carried over from the laptop site (LaudaturAkatemia-main).

const VALUES = [
  {
    title: 'Tasa-arvoiset mahdollisuudet',
    text: 'Haluamme luoda jokaisella mahdollisuuden oppia ja kehittyä taustasta riippumatta. Menestymisen tulee olla riippuvaista kovasta työstä ja taidoista.',
  },
  {
    title: 'Kaikille tasoille',
    text: 'Materiaalimme on suunniteltu niin, että opiskelija voi edetä itsenäisesti, tehokkaasti ja tavoitteellisesti. Akatemia tarjoaa opiskelusuunnitelmaa kaikille tavoitetasoille ja pystyy tarjoamaan kilpailukykyistä opetusmateriaalia niille, joille yksityisopetus on liian kallista.',
  },
  {
    title: 'Laadukkaasti',
    text: 'Meille on tärkeää, että opetusmateriaali on laadukasta ja mielekästä, sillä se kasvattaa opiskelijan motivaatiota jatkaa opintojen parissa. Panostamme selkeyteen, ymmärrettävyyteen ja rakenteelliseen johdonmukaisuuteen.',
  },
]

const PEOPLE = [
  {
    name: 'Lauri Paloneva',
    role: '"CEO"',
    email: 'lauri.paloneva556@gmail.com',
    linkedin: 'https://www.linkedin.com/in/lauripaloneva/',
  },
  {
    name: 'Akseli Lajunen',
    role: 'Ahkera matemaatikko. Tehtävä arkkitehti.',
    email: 'lajunenakseli@gmail.com',
    linkedin: 'https://www.linkedin.com/in/akseli-lajunen-853786246/',
  },
  {
    name: 'Aaron Juuti',
    role: 'Ahkera matemaatikko. Tehtävä arkkitehti.',
    email: 'aaron.juuti@gmail.com',
    linkedin: 'https://www.linkedin.com/in/aaron-juuti-62491b275/',
  },
]

export default function EsittelyPage() {
  return (
    <InfoPage>
      <InfoHero title="Tervetuloa Laudatur Akatemiaan!">
        <p>Laudatur akatemia on palvelu, joka on omistettu lukion matematiikan oppimäärän kertaamiseen.</p>
      </InfoHero>

      <InfoCard>
        <p>
          Nimessä oleva <strong>Laudatur</strong> ei suinkaan viittaa siihen, että tämä sivusto on tarjolla vain
          huippuopiskelijoille. Pikemminkin haluamme tehdä asiat "loistavasti" ja tarjota kaikille eväät omaan
          parhaaseen suoritukseen.
        </p>
        <p>
          Akatemia on syntynyt halusta tarjota jokaiselle opiskelijalle mahdollisuus kehittää taitojaan, vahvistaa
          osaamistaan matematiikassa ja saavuttaa tavoitteensa omassa tahdissaan – riippumatta käytettävissä olevista
          resursseista.
        </p>
      </InfoCard>

      <InfoSection title="Tavoitteemme">
        <InfoCard>
          <p className="text-center text-xl font-bold">
            Halpa, laadukas opiskelumateriaali, joka mahdollistaa Korkeakouluhaaveen kaikille.
          </p>
          <p>
            Uskomme siihen, että koulutus kuuluu kaikille. Meidän tavoitteemme on madaltaa oppimisen esteitä tarjoamalla
            laadukasta ja kattavaa opiskelumateriaalia, joka tukee itsenäistä opiskelua.
          </p>
          <p>
            Suomessa laadukas koulutus on ollut yksi merkittävimmistä asioista luomassa tasa-arvoisempaa yhteiskuntaa.
            Haluamme olla osana säilyttämässä tätä.
          </p>
        </InfoCard>
      </InfoSection>

      <InfoSection title="Akatemian arvot" center>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {VALUES.map((value) => (
            <InfoCard key={value.title} title={value.title}>
              <p className="text-sm">{value.text}</p>
            </InfoCard>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="Ihmiset akatemian takana" center>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PEOPLE.map((person) => (
            <InfoCard key={person.name} title={person.name}>
              <p className="text-center text-sm text-ink-dim">{person.role}</p>
              <ContactLinks email={person.email} linkedin={person.linkedin} />
            </InfoCard>
          ))}
        </div>
      </InfoSection>
    </InfoPage>
  )
}
