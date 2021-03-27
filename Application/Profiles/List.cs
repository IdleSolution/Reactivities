using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class List
    {
        public class Query : IRequest<List<Profile>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Profile>>
        {
            private readonly DataContext _context;
            private readonly IProfileReader _profileReader;

            public Handler(DataContext context, IProfileReader profileReader)
            {
                _context = context;
                _profileReader = profileReader;
            }
            public async Task<List<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var userFollowings = new List<UserFollowing>();
                var profiles = new List<Profile>();
                switch (request.Predicate)
                {
                    case "followers":
                        {
                            userFollowings = await _context.Followings.Where(x => x.Target.UserName == request.Username).ToListAsync();
                            foreach (var follower in userFollowings)
                            {
                                profiles.Add(await _profileReader.ReadProfile(follower.Observer.UserName));
                            }
                            break;
                        }

                    case "followings":
                        {
                            foreach(var obs in _context.Followings)
                            {
                                Console.WriteLine(obs.Observer.UserName);
                            }
                            userFollowings = await _context.Followings.Where(x => x.Observer.UserName == request.Username).ToListAsync();
                            foreach (var follower in userFollowings)
                            {
                                profiles.Add(await _profileReader.ReadProfile(follower.Target.UserName));
                            }
                            break;
                        }
                }
                return profiles;
            }
        }
    }
}