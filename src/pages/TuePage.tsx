import { InfoCard, InfoHero, InfoPage, InfoSection } from './infoUi'

// Etusivu › Tue projektia, carried over from the laptop site (LaudaturAkatemia-main).
export default function TuePage() {
  return (
    <InfoPage>
      <InfoHero title="Haluatko tukea Laudatur Akatemiaa?" />

      <InfoCard>
        <p>
          Laudatur akatemian arvot ja toimintaperiaate pyrkii siihen, että kaikilla on mahdollisuus laadukkaaseen
          opiskeluun. Niinpä maksu alustan käytöstä pohjautuu alustavasti vapaaehtoisuuteen. Tällä hetkellä voit maksaa
          niin paljon kuin haluat, eli myös 0€ jos koet, että sinulla ei ole varaa juuri nyt tai et koe palvelua sen
          arvoiseksi.
        </p>
        <p>
          Tulevaisuudessa, mikäli alustalle on kysyntää, saatamme laajentaa palvelua, ja kehittää maksullisia
          toiminnallisuuksia. Maksullisuutta sovellettaisiin toiminnallisuuksiin, jotka tuottavat säännöllisiä
          kustannuksia ja/tai laajempaa kehitystyötä, ja sillä mahdollistettaisiin toiminnan jatkuvuus. Silloinkin on
          tarkoitus pysyä arvoissamme ja pitää hinta kohtuullisena, jotta palvelu on tarjolla mahdollisimman monelle.
        </p>
      </InfoCard>

      <InfoSection title="Maksa mitä haluat" center>
        <InfoCard>
          <p>
            Mikäli jaat arvomme ja haluat tukea projektiamme, voit ostaa alla olevan linkin kautta vanhan kirjani.
            Tuotos ei välttämättä ole maailman laadukkain, mutta ei silti täysin puuta heinää. Vaihtoehtoisesti voit
            tiedustella yhteistyömahdollisuuksista.
          </p>
          <p className="text-center">
            <a
              href="https://kirjakauppa.bod.fi/how-to-succeed-in-school-lauri-paloneva-9789528061632"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-accent px-6 py-2.5 font-semibold text-white shadow-md transition-opacity hover:opacity-90"
            >
              Linkki kirjakauppaan
            </a>
          </p>
        </InfoCard>
      </InfoSection>

      <InfoSection title="Mitä tuotoille tapahtuu?">
        <div className="flex flex-col gap-4">
          <InfoCard>
            <p className="text-center text-xl font-bold">
              Läpinäkyvyyden vuoksi haluan avata tarkemmin miten tienatut rahat aiotaan käyttää:
            </p>
          </InfoCard>
          <InfoCard>
            <p>
              Ensimmäiset mahdolliset noin 5000€ käytetään lyhentämättömänä lahjakkaiden ja ahkerien tehtävien luojien
              palkkioihin.
            </p>
          </InfoCard>
          <InfoCard>
            <p>
              Mahdolliset seuraavat ~ 20 000 € (aina saa haaveilla) käytetään alustan kehitystyöhön. Käytännössä tämä
              tarkoittaa kahta asiaa. Kehitystyön ulkoistamista tai kompensaatiota sivuston perustajille, jotta he voivat
              panostaa projektiin lisää aikaansa. Eli siis maksamme palkkaa jollekin tai itsellemme.
            </p>
          </InfoCard>
          <InfoCard>
            <p>
              Tämän jälkeisiä tuloja pidetään kivana plussana (ja epätodennäköisinä). Mikäli rahaa tulee jostain syystä
              paljon, pyrin keksimään jonkun hyvän lahjoituskohteen, joka tukee opiskelijoiden mielenterveyttä tai jonkin
              vastaavan, johon sitten laitetaan jokin prosenttiosuus tästä ylimenevästä osasta.
            </p>
          </InfoCard>
        </div>
      </InfoSection>
    </InfoPage>
  )
}
