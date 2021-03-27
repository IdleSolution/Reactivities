using System.Linq;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly IUserAccessor _userAccessor;
        private readonly DataContext _context;

        public ProfileReader(IUserAccessor userAccessor, DataContext context)
        {
            _userAccessor = userAccessor;
            _context = context;
        }
        public async Task<Profile> ReadProfile(string username)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == username);

            if(user == null)
            {
                throw new RestException(System.Net.HttpStatusCode.NotFound, new {User = "User was not found!"});
            }

            var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

            var profile = new Profile
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Bio = user.Bio,
                IsFollowed = user.Followers.Any(x => x.ObserverId == currentUser.Id),
                FollowersCount = user.Followers.Count(),
                Photos = user.Photos,
                FollowingCount = user.Followings.Count()
            };

            return profile;

        }
    }
}