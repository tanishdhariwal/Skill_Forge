import axios from "axios";

export const generateStudyPlan = async (
  topic: string,
  level: string,
  experience: number
) => {
  try {
    const response = await axios.post("/studyPlan/generateStudyPlan", {
      experience,
      topic,
      level
    });
    return response.data;
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw new Error("Failed to generate study plan");
  }
  /**
 * 
 * post:
http://127.0.0.1:5000/api/v1/studyPlan/generateStudyPlan
request body:
{
    "experience":7,
    "topic":"java",
    "level":"advanced"
}

 */
};

export const getPlansTiles = async () => {
  try {
    const response = await axios.get("/studyPlan/plantiles");
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    throw new Error("Error fetching study plan tiles: ");
  }
  /**
   *
   * get:
   *   http://127.0.0.1:5000/api/v1/studyPlan/plantiles
   *
   * res:
   * [
   *   {
   *      "_id": "67ee90a611e46a00575755eb",
   *     "title": "Full-Stack Web Development",
   *   },
   *  {
   *     "_id": "67ee921b53424d30c34dcebe",
   *    "title": "java - advanced",
   *  }
   * ]
   *
   *
   * */
};

export const getStudyPlan = async (id: string) => {
  try {
    const response = await axios.get(`/studyPlan/getPlan/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching study plan:", error);
    throw new Error("Failed to fetch study plan");
  }
  /**
     * 
     * get:
const res = axios.get("/studyPlan/getPlan/:id");
format of res:
[
    {
        "_id": "67ee90a611e46a00575755eb",
        "title": "Full-Stack Web Development",
        "nodes": [
            {
                "_id": "67ee90a611e46a00575755e7",
                "title": "HTML & CSS Basics",
                "description": "Learn the fundamentals of web structure and styling.",
                "type": "Mandatory",
                "link": "https://example.com/html-css",
                "__v": 0
            },
            {
                "_id": "67ee90a611e46a00575755e8",
                "title": "JavaScript Basics",
                "description": "Learn JavaScript fundamentals and DOM manipulation.",
                "type": "Mandatory",
                "link": "https://example.com/javascript",
                "__v": 0
            },
            {
                "_id": "67ee90a611e46a00575755e9",
                "title": "React.js",
                "description": "Understand React components and state management.",
                "type": "Optional",
                "link": "https://example.com/react",
                "__v": 0
            }
        ],
        "edges": [
            {
                "from": {
                    "_id": "67ee90a611e46a00575755e7",
                    "title": "HTML & CSS Basics",
                    "description": "Learn the fundamentals of web structure and styling.",
                    "type": "Mandatory",
                    "link": "https://example.com/html-css",
                    "__v": 0
                },
                "to": {
                    "_id": "67ee90a611e46a00575755e8",
                    "title": "JavaScript Basics",
                    "description": "Learn JavaScript fundamentals and DOM manipulation.",
                    "type": "Mandatory",
                    "link": "https://example.com/javascript",
                    "__v": 0
                },
                "label": "Prerequisite",
                "_id": "67ee90a611e46a00575755ec"
            },
            {
                "from": {
                    "_id": "67ee90a611e46a00575755e8",
                    "title": "JavaScript Basics",
                    "description": "Learn JavaScript fundamentals and DOM manipulation.",
                    "type": "Mandatory",
                    "link": "https://example.com/javascript",
                    "__v": 0
                },
                "to": {
                    "_id": "67ee90a611e46a00575755e7",
                    "title": "HTML & CSS Basics",
                    "description": "Learn the fundamentals of web structure and styling.",
                    "type": "Mandatory",
                    "link": "https://example.com/html-css",
                    "__v": 0
                },
                "label": "Corequisite",
                "_id": "67ee90a611e46a00575755ed"
            }
        ],
        "public": false,
        "author": "67ee8ecdec928f8190cea91c",
        "custom": false,
        "createdAt": "2025-04-03T13:44:06.947Z",
        "updatedAt": "2025-04-03T13:44:06.947Z",
        "__v": 0
    },
    {
        "_id": "67ee921b53424d30c34dcebe",
        "title": "java - advanced",
        "nodes": [
            {
                "_id": "67ee921b53424d30c34dceb6",
                "title": "Advanced JVM Internals & Performance Tuning",
                "description": "Deep dive into JVM architecture, JIT compilation, garbage collection, memory management, and performance tuning techniques to optimize Java applications.",
                "type": "Mandatory",
                "link": "https://www.oracle.com/technical-resources/articles/javase/jvm-garbage-collection.html",
                "__v": 0
            },
            {
                "_id": "67ee921b53424d30c34dceb7",
                "title": "Advanced Concurrency & Parallelism",
                "description": "Master sophisticated concurrency utilities including multi-threading, Fork/Join framework, CompletableFuture, parallel streams, and best practices to build effective multi-threaded applications.",
                "type": "Mandatory",
                "link": "https://www.baeldung.com/java-concurrency",
                "__v": 0
            },
            {
                "_id": "67ee921b53424d30c34dceb8",
                "title": "Design Patterns & Software Architecture",
                "description": "Explore modern design patterns and architectural principles applicable to scalable Java systems, with a focus on microservices, domain-driven design, and clean coding practices.",
                "type": "Mandatory",
                "link": "https://refactoring.guru/design-patterns",
                "__v": 0
            },
            {
                "_id": "67ee921b53424d30c34dceb9",
                "title": "Microservices & Cloud with Java",
                "description": "Learn to design, build, and deploy microservices using popular frameworks such as Spring Boot and Spring Cloud, emphasizing scalability, resilience, and integration with cloud platforms.",
                "type": "Mandatory",
                "link": "https://spring.io/projects/spring-boot",
                "__v": 0
            },
            {
                "_id": "67ee921b53424d30c34dceba",
                "title": "Reactive Programming with Java",
                "description": "Delve into the reactive programming paradigm and explore reactive streams, utilizing libraries like Project Reactor and RxJava to build responsive and resilient systems.",
                "type": "Mandatory",
                "link": "https://projectreactor.io",
                "__v": 0
            },
            {
                "_id": "67ee921b53424d30c34dcebb",
                "title": "Advanced Security in Java",
                "description": "Focus on secure coding practices, understanding vulnerabilities, integrating security frameworks, and employing encryption techniques to safeguard Java applications.",
                "type": "Mandatory",
                "link": "https://owasp.org",
                "__v": 0
            },
            {
                "_id": "67ee921b53424d30c34dcebc",
                "title": "Emerging Java Technologies & Trends",
                "description": "Stay abreast of the latest advancements in Java, including new language features, modular programming (Project Jigsaw), and cross-JVM language integration (e.g., Kotlin, Scala).",
                "type": "Optional",
                "link": "https://openjdk.java.net/projects/jigsaw/",
                "__v": 0
            }
        ],
        "edges": [
            {
                "from": {
                    "_id": "67ee921b53424d30c34dceb6",
                    "title": "Advanced JVM Internals & Performance Tuning",
                    "description": "Deep dive into JVM architecture, JIT compilation, garbage collection, memory management, and performance tuning techniques to optimize Java applications.",
                    "type": "Mandatory",
                    "link": "https://www.oracle.com/technical-resources/articles/javase/jvm-garbage-collection.html",
                    "__v": 0
                },
                "to": {
                    "_id": "67ee921b53424d30c34dceb7",
                    "title": "Advanced Concurrency & Parallelism",
                    "description": "Master sophisticated concurrency utilities including multi-threading, Fork/Join framework, CompletableFuture, parallel streams, and best practices to build effective multi-threaded applications.",
                    "type": "Mandatory",
                    "link": "https://www.baeldung.com/java-concurrency",
                    "__v": 0
                },
                "label": "",
                "_id": "67ee921b53424d30c34dcebf"
            },
            {
                "from": {
                    "_id": "67ee921b53424d30c34dceb7",
                    "title": "Advanced Concurrency & Parallelism",
                    "description": "Master sophisticated concurrency utilities including multi-threading, Fork/Join framework, CompletableFuture, parallel streams, and best practices to build effective multi-threaded applications.",
                    "type": "Mandatory",
                    "link": "https://www.baeldung.com/java-concurrency",
                    "__v": 0
                },
                "to": {
                    "_id": "67ee921b53424d30c34dceba",
                    "title": "Reactive Programming with Java",
                    "description": "Delve into the reactive programming paradigm and explore reactive streams, utilizing libraries like Project Reactor and RxJava to build responsive and resilient systems.",
                    "type": "Mandatory",
                    "link": "https://projectreactor.io",
                    "__v": 0
                },
                "label": "",
                "_id": "67ee921b53424d30c34dcec0"
            },
            {
                "from": {
                    "_id": "67ee921b53424d30c34dceb8",
                    "title": "Design Patterns & Software Architecture",
                    "description": "Explore modern design patterns and architectural principles applicable to scalable Java systems, with a focus on microservices, domain-driven design, and clean coding practices.",
                    "type": "Mandatory",
                    "link": "https://refactoring.guru/design-patterns",
                    "__v": 0
                },
                "to": {
                    "_id": "67ee921b53424d30c34dceb9",
                    "title": "Microservices & Cloud with Java",
                    "description": "Learn to design, build, and deploy microservices using popular frameworks such as Spring Boot and Spring Cloud, emphasizing scalability, resilience, and integration with cloud platforms.",
                    "type": "Mandatory",
                    "link": "https://spring.io/projects/spring-boot",
                    "__v": 0
                },
                "label": "",
                "_id": "67ee921b53424d30c34dcec1"
            },
            {
                "from": {
                    "_id": "67ee921b53424d30c34dceb9",
                    "title": "Microservices & Cloud with Java",
                    "description": "Learn to design, build, and deploy microservices using popular frameworks such as Spring Boot and Spring Cloud, emphasizing scalability, resilience, and integration with cloud platforms.",
                    "type": "Mandatory",
                    "link": "https://spring.io/projects/spring-boot",
                    "__v": 0
                },
                "to": {
                    "_id": "67ee921b53424d30c34dcebb",
                    "title": "Advanced Security in Java",
                    "description": "Focus on secure coding practices, understanding vulnerabilities, integrating security frameworks, and employing encryption techniques to safeguard Java applications.",
                    "type": "Mandatory",
                    "link": "https://owasp.org",
                    "__v": 0
                },
                "label": "",
                "_id": "67ee921b53424d30c34dcec2"
            },
            {
                "from": {
                    "_id": "67ee921b53424d30c34dceb6",
                    "title": "Advanced JVM Internals & Performance Tuning",
                    "description": "Deep dive into JVM architecture, JIT compilation, garbage collection, memory management, and performance tuning techniques to optimize Java applications.",
                    "type": "Mandatory",
                    "link": "https://www.oracle.com/technical-resources/articles/javase/jvm-garbage-collection.html",
                    "__v": 0
                },
                "to": {
                    "_id": "67ee921b53424d30c34dcebc",
                    "title": "Emerging Java Technologies & Trends",
                    "description": "Stay abreast of the latest advancements in Java, including new language features, modular programming (Project Jigsaw), and cross-JVM language integration (e.g., Kotlin, Scala).",
                    "type": "Optional",
                    "link": "https://openjdk.java.net/projects/jigsaw/",
                    "__v": 0
                },
                "label": "",
                "_id": "67ee921b53424d30c34dcec3"
            },
            {
                "from": {
                    "_id": "67ee921b53424d30c34dcebc",
                    "title": "Emerging Java Technologies & Trends",
                    "description": "Stay abreast of the latest advancements in Java, including new language features, modular programming (Project Jigsaw), and cross-JVM language integration (e.g., Kotlin, Scala).",
                    "type": "Optional",
                    "link": "https://openjdk.java.net/projects/jigsaw/",
                    "__v": 0
                },
                "to": {
                    "_id": "67ee921b53424d30c34dceb8",
                    "title": "Design Patterns & Software Architecture",
                    "description": "Explore modern design patterns and architectural principles applicable to scalable Java systems, with a focus on microservices, domain-driven design, and clean coding practices.",
                    "type": "Mandatory",
                    "link": "https://refactoring.guru/design-patterns",
                    "__v": 0
                },
                "label": "",
                "_id": "67ee921b53424d30c34dcec4"
            }
        ],
        "public": false,
        "author": "67ee8ecdec928f8190cea91c",
        "custom": false,
        "createdAt": "2025-04-03T13:50:19.901Z",
        "updatedAt": "2025-04-03T13:50:19.901Z",
        "__v": 0
    }
]
     */
};
