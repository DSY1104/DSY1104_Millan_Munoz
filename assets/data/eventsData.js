// eventsData.js
export const techAndGamingEvents = [
  {
    name: "ChileGameFest 2025",
    location: "Espacio Riesco",
    region: "Región Metropolitana",
    dates: "Miércoles 24 a Domingo 28 de Septiembre de 2025",
    hours: "10:00 a 20:00 hrs",
    description:
      "La feria de videojuegos más grande de Chile. Reúne a los principales estudios nacionales e internacionales para presentar avances y demos jugables de sus próximos lanzamientos. Cuenta con una gran zona de freeplay con consolas y PCs, torneos de eSports, áreas de realidad virtual, charlas con desarrolladores y una feria de indies donde los creadores locales muestran su talento. El evento ideal para gamers de todos los niveles.",
    image: "assets/image/maps/espacioRiesco.png",
  },
  {
    name: "TechAndoSantiago 2025",
    location: "Parque Bicentenario de Vitacura",
    region: "Región Metropolitana",
    dates: "Jueves 2 a Domingo 5 de Octubre de 2025",
    hours: "09:30 a 19:30 hrs",
    description:
      "Un festival al aire libre que combina tecnología, innovación y entretenimiento para toda la familia. Con charlas sobre smart cities, Internet de las Cosas (IoT) y startups, junto a zonas interactivas de drones, robótica e impresión 3D. Por las noches, se transforma en un centro de entretenimiento con proyecciones mapping en los edificios del parque y conciertos de artistas que fusionan música y tecnología en vivo.",
    image: "assets/image/maps/bicentenario.png",
  },
  {
    name: "Iquique CryptoCon 2025",
    location: "Estadio Tierra de Campeones",
    region: "Región de Antofagasta (2da Región)",
    dates: "Viernes 3 a Domingo 5 de Octubre de 2025",
    hours: "11:00 a 21:00 hrs",
    description:
      "El principal evento del norte grande sobre tecnologías disruptivas. Enfocado en blockchain, criptomonedas, NFTs y el metaverso. Ofrece conferencias de expertos internacionales, talleres prácticos para aprender a minar o tradear, zonas de inmersión en mundos virtuales y un espacio para que startups del rubro presenten sus proyectos. Una oportunidad única para estar a la vanguardia en el desierto de Atacama.",
    image: "assets/image/maps/tierraCampeones.png",
  },
  {
    name: "Concepción Game Summit",
    location: "Estadio Ester Roa",
    region: "Región del Biobío (8va Región)",
    dates: "Jueves 9 a Domingo 12 de Octubre de 2025",
    hours: "10:00 a 20:00 hrs",
    description:
      "El punto de encuentro para la creciente comunidad gamer del sur de Chile. Este evento se enfoca en la cultura gamer y los eSports, con grandes torneos de League of Legends, Counter-Strike 2 y Tekken 8 con importantes premios en dinero. Además, cuenta con una feria de comercio relacionado, invitados especiales como streamers nacionales y la posibilidad de probar periféricos de última generación.",
    image: "assets/image/maps/esterRoa.png",
  },
  {
    name: "Viña PC Master Expo",
    location: "Estadio Sausalito",
    image: "assets/image/maps/sausalito.png",
    region: "Región de Valparaíso (5ta Región)",
    dates: "Viernes 17 a Domingo 19 de Octubre de 2025",
    hours: "10:00 a 20:00 hrs",
    description:
      "La convención definitiva para los entusiastas del hardware y el armado de PCs. Los principales retailers y representantes de marcas como NVIDIA, AMD, ASUS y Corsair presentan sus nuevos componentes. Los asistentes pueden armar PCs virtuales, participar en competencias de overclocking, asistir a charlas técnicas y disfrutar de impresionantes shows de modding, donde PCs son transformados en verdaderas obras de arte.",
  },
  {
    name: "RetroMad – Feria del Videojuego Retro",
    location: "Teatro Caupolicán",
    image: "assets/image/maps/caupolican.png",
    region: "Región Metropolitana",
    dates: "Sábado 18 a Domingo 19 de Octubre de 2025",
    hours: "11:00 a 21:00 hrs",
    description:
      "Un viaje en el tiempo para los nostálgicos y coleccionistas. Este evento celebra la historia de los videojuegos con miles de consolas, cartuchos, arcades y accesorios retro en exhibición y venta. Puedes jugar en máquinas arcade clásicas, competir en torneos de SNES y Sega Genesis, y asistir a charlas sobre la preservación de videojuegos. El lugar perfecto para revivir la era de los 8 y 16 bits.",
  },
  {
    name: "eSports Monumental",
    location: "Estadio Monumental",
    image: "assets/image/maps/monumental.png",
    region: "Región Metropolitana",
    dates: "Miércoles 22 a Domingo 26 de Octubre de 2025",
    hours: "12:00 a 23:00 hrs",
    description:
      "El espectáculo de eSports más masivo del año, que llena las tribunas del coloso de Macul. Presenta la gran final de la liga nacional de Free Fire y VALORANT, con equipos compitiendo por el título de campeón y un prize pool récord. El evento se complementa con un festival alrededor de la cancha con stands de marcas, foodtrucks, shows en vivo y meet & greets con los pro-players más famosos del país.",
  },
  {
    name: "Festival de la Ciencia y Juego FIC2025",
    location: "Quinta Vergara",
    image: "assets/image/maps/quintaVergara.png",
    region: "Región de Valparaíso (5ta Región)",
    dates: "Viernes 24 a Domingo 26 de Octubre de 2025",
    hours: "10:00 a 18:00 hrs",
    description:
      "Un evento único en el emblemático anfiteatro de Viña del Mar que fusiona educación, ciencia y juegos. Diseñado para familias y jóvenes, ofrece talleres de programación para niños, laboratorios de robótica, charlas sobre la ciencia detrás de los videojuegos y una feria de proyectos de ingeniería y software de universidades de la región. Un espacio lúdico y educativo en un entorno patrimonial.",
  },
];

/**
 * Guarda un array de eventos en localStorage bajo la clave 'techAndGamingEvents'.
 * @param {Array} eventsArray - Array de eventos a guardar.
 */
export function saveEventsToLocalStorage(eventsArray) {
  if (Array.isArray(eventsArray)) {
    localStorage.setItem("techAndGamingEvents", JSON.stringify(eventsArray));
  } else {
    console.error("El parámetro no es un array válido de eventos.");
  }
}

/**
 * Obtiene los eventos almacenados en localStorage bajo la clave 'techAndGamingEvents'.
 * @returns {Array} Array de eventos o [] si no hay datos.
 */
export function getEventsFromLocalStorage() {
  const data = localStorage.getItem("techAndGamingEvents");
  return data ? JSON.parse(data) : [];
}
