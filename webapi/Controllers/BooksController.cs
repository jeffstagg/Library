using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using webapi.Models;
using Microsoft.AspNetCore.Authorization;

namespace webapi.Controllers
{
    [Route("api/books")]
    public class BooksController : Controller
    {
        [HttpGet("/public")]
        public IEnumerable<Book> Public()
        {
            return new List<Book>() {
                new Book {
                    Title = "A Tale Of Two Cities",
                    Author = "Charles Dickens"
                },

                new Book {
                    Title = "The Great Gatsby",
                    Author = "F. Scott Fitzgerald"
                },

                new Book {
                    Title = "1984",
                    Author = "George Orwell"
                },

                new Book {
                    Title = "The Odyssey",
                    Author = "Homer"
                },
                new Book {
                    Title = "The Adventures of Huckleberry Finn",
                    Author = "Mark Twain"
                },

                new Book {
                    Title = "Pride And Prejudice",
                    Author = "Jane Austen"
                },
                new Book {
                    Title = "Alice's Adventures In Wonderland",
                    Author = "Lewis Carroll"
                },

                new Book {
                    Title = "Great Expectations",
                    Author = "Charles Dickens"
                },
                new Book {
                    Title = "Gulliver's Travels",
                    Author = "Jonathan Swift"
                },

                new Book {
                    Title = "The Doors Of Perception",
                    Author = "Aldous Huxley"
                }

            };
        }

        [HttpGet("/private")]
        [Authorize]
        public IEnumerable<Book> Private()
        {
            return new List<Book>() {
                new Book {
                    Title = "Twilight",
                    Author = "Stephenie Meyer"
                },

                new Book {
                    Title = "The Da Vinci Code",
                    Author = "Dan Brown"
                },

                new Book {
                    Title = "Fifty Shades of Grey",
                    Author = "E L James"
                },

                new Book {
                    Title = "Eat, Pray, Love",
                    Author = "Elizabeth Gilbert"
                },

                new Book {
                    Title = "Harry Potter and the Sorcerer's Stone",
                    Author = "J K Rowling"
                }
            };
        }
    }
}