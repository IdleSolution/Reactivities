using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UnAttend
    {
        public class Command : IRequest
        {
            public Guid ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if(activity == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new {Activity = "Could not find any activity!"});
                }

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var attendance = await _context.UserActivities.SingleOrDefaultAsync(
                    x => x.ActivityId == request.ActivityId && x.AppUserId == user.Id
                );

                if(attendance == null)
                {
                    return Unit.Value;
                }

                if(attendance.IsHost)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new {attendance = "You cannot remove yourself as a host"});
                }

                _context.UserActivities.Remove(attendance);

                bool success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}