using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Persistence;


namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }
        
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);
                if(activity == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new {Activity = "Not found"});
                }

                var host = activity.UserActivities.Single(x => x.IsHost);

                if(host.AppUser.UserName != _userAccessor.GetCurrentUsername())
                {
                    throw new RestException(HttpStatusCode.Unauthorized, new {Authorization = "You are not a host!"});
                }

                _context.Remove(activity);
        
                bool success = await _context.SaveChangesAsync() > 0;
        
                if (success) return Unit.Value;
        
                throw new Exception("Problem saving changes");
            }
        }
    }
}